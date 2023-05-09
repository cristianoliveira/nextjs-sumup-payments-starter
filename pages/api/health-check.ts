import type { NextApiHandler, NextApiResponse } from 'next';
import type {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import {
  trace,
  context,
  SpanKind,
  propagation,
  Span,
  SpanStatusCode,
  ROOT_CONTEXT,
} from '@opentelemetry/api';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
} from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';

const SERVICE_NAME = 'op-integrator-dashboard';
const OTEL_API_AUTH_TOKEN = 'payment-widget:payment-widget';

const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: SERVICE_NAME,
  }),
});

const exporter = !process.env.OTEL_API_URL
  ? new ConsoleSpanExporter()
  : new OTLPTraceExporter({
      url: process.env.OTEL_API_URL,
      headers: {
        Authorization: `Basic ${Buffer.from(OTEL_API_AUTH_TOKEN).toString(
          'base64',
        )}`,
      },
    });

// provider.addSpanProcessor(new BatchSpanProcessor(exporter));

// provider.register();

export const tracer = trace.getTracer(SERVICE_NAME);

type WithOpenTelemetry = {
  (callback: NextApiHandler): NextApiHandler;
};

export const withOpenTelemetry: WithOpenTelemetry =
  (callback) => (req, res) => {
    const rootCtx = propagation.extract(ROOT_CONTEXT, req.headers);

    const url = new URL(req.url!, `https://${req.headers.host!}`);
    const span = tracer.startSpan(
      `HTTP ${req.method!} ${req.url!}`,
      {
        kind: SpanKind.SERVER,
        attributes: {
          'http.url': url.href,
          'http.method': req.method,
          'http.host': url.host,
          'http.client_ip': req.headers['x-forwarded-for'],
          'http.user_agent': req.headers['user-agent'],
          'http.referer': req.headers.referer,
          'http.scheme': url.protocol,
          'http.target': url.pathname,
          'net.host.name': url.host,
        },
      },
      rootCtx,
    );

    const requestCtx = trace.setSpan(rootCtx, span);

    return new Promise<void>((resolve) => {
      context.with(requestCtx, async () => {
        const resProxy = new Proxy<NextApiResponse>(res, {
          get(target: NextApiResponse, prop: keyof NextApiResponse) {
            if (prop === 'status') {
              return (statusCode: number) => {
                target.status(statusCode);
                return resProxy;
              };
            }

            const sendData = {
              send: (data: any) => {
                provider.forceFlush().finally(() => {
                  target.send(data);
                  resolve();
                });
              },
              json: (data: Record<string | number | symbol, unknown>) => {
                provider.forceFlush().finally(() => {
                  target.json(data);
                  resolve();
                });
              },
            };

            const sendDataFunc = sendData[prop];
            if (sendDataFunc) {
              span.setAttribute('http.status_code', target.statusCode);
              span.end();

              return sendDataFunc;
            }

            return target[prop];
          },
        });

        try {
          await callback(req, resProxy);
        } catch (error) {
          const errorMessage =
            (error as AxiosError).message || 'Internal unknown error';

          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: errorMessage,
          });

          span.recordException(
            (error as Error) || `Error executing ${SERVICE_NAME} handler!`,
            Date.now(),
          );

          const status = (error as AxiosError).status || 500;

          resProxy.status(status).send({ message: errorMessage });
          resolve();
        }
      });
    });
  };

// const exporter = new ConsoleSpanExporter();
const processor = new BatchSpanProcessor(exporter);
provider.addSpanProcessor(processor);

provider.register();

const handler: NextApiHandler = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: `ok ${process.env.OTEL_API_URL}`.substring(0, 10),
  });
};

export default withOpenTelemetry(handler);
