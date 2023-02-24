export default function injectScript({
  scriptSrc,
  container,
  win = window,
}: {
  scriptSrc: string;
  container?: HTMLElement;
  win?: Window;
}) {
  return new Promise((resolve) => {
    const script = win.document.createElement('script');
    script.type = 'text/javascript';
    script.onload = () => resolve(win);
    script.src = scriptSrc;
    (container || win.document.body).appendChild(script);
  });
}
