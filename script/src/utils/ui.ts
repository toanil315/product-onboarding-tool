export class UiUtils {
  static checkIsInViewport(element: HTMLElement): Promise<boolean> {
    return new Promise((resolve) => {
      let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          resolve(entry.isIntersecting);
          observer.unobserve(entry.target);
        });
      });

      observer.observe(element);
    });
  }

  static setStyle(element: HTMLElement, styleName: string, value: string) {
    element.style[styleName as "fontSize"] = value;
  }

  static getElementIndex(child: HTMLElement | Node | null) {
    if (!child) return;

    const parentElementWhichSameTypes = Array.from(
      child.parentElement?.children || []
    ).filter((el) => el.tagName === (child as any).tagName);
    if (parentElementWhichSameTypes.length === 1) return -1;
    return [].indexOf.call(parentElementWhichSameTypes, child as never) + 1;
  }

  static indexElementStr = (index: number = -1) => {
    if (index === -1) return "";
    return `:nth-of-type(${index})`;
  };

  static getDomHierarchy(e: HTMLElement) {
    const result = [];
    const indexOfElement = this.getElementIndex(e);
    result.push(e.tagName + this.indexElementStr(indexOfElement));
    while ((e?.parentNode as any).tagName !== "HTML") {
      const nthChild = this.getElementIndex(e?.parentNode);
      result.push(
        (e?.parentNode as any).tagName + this.indexElementStr(nthChild)
      );
      e = e?.parentNode as any;
    }
    return result
      .map((e) => e.toLowerCase())
      .reverse()
      .join(" > ");
  }
}
