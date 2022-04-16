/**
 * Copyright © 2022 Tony Spegel
 */

class ObserverMcObserverFace {
  public observer: IntersectionObserver = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        console.log(entry);

        if (entry.isIntersecting) {
          console.log(entry);
        }
      });

      // this.manageVisibility(entries);
      // this.manageFirstVisibleElement();
    },
    {
      threshold: [1],
      root: document.querySelector('body header'),
    },
  );

  private visibilityByElement = new Map<Element, boolean>();
  public firstVisibleElement!: Element;

  private manageVisibility(entries: IntersectionObserverEntry[]): void {
    for (const entry of entries) {
      this.visibilityByElement.set(entry.target, entry.isIntersecting);
    }

    console.log(this.visibilityByElement);
  }

  private manageFirstVisibleElement() {
    const visibleElements = Array.from(
      this.visibilityByElement.entries(),
    ).filter(([, value]) => value);

    this.firstVisibleElement = visibleElements[0][0] ?? null;

    console.log(visibleElements);
    console.log(this.firstVisibleElement);

    // document
    //   ?.querySelectorAll('.toc-link')
    //   .forEach((tocLink) => tocLink.removeAttribute('aria-current'));

    // document
    //   ?.querySelector(`a[href='#${visibleElements[0][0].id}']`)
    //   ?.setAttribute('aria-current', 'true');
  }
}
