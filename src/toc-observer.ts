/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html} from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';

/**
 * <toc-observer> highlights elements in a table of contents
 * if their counterparts are visible in the viewport.
 *
 * @slot - This element has a slot
 *
 * Copyright © 2022 Tony Spegel
 */
@customElement('toc-observer')
export class TocObserver extends LitElement {
  // Converts '_tocList' into a getter that returns the assignedElements of the given slot
  @queryAssignedElements({slot: 'toc'})
  private _tocList?: Array<HTMLUListElement>;

  // CSS class which is set when observer items are visible
  @property({type: String})
  public tocActiveClass = 'toc-active';

  // Identifies the element or document as a reference for interecting items
  @property({type: String})
  public rootElement?: string;

  /**
   * Useful for observing nested markup like this:
   * <section>
   *   <!-- ^observe -->
   *   <h2 id="possum">Possum</h2>
   * </section>
   *
   * Observing wrapper elements instead of just headings
   * has the advantage that those have more area to intersect with.
   *
   *     ┌─────────┐
   *     │ #possum │
   *   ┌─┼─────────┼─┐
   *   │ │         │ │
   *   │ └─────────┘ │< Viewport
   *   │ ^section    │
   *   │             │
   *   └─────────────┘
   *
   */
  @property({type: Boolean})
  public observeParent = false;

  // Should be used together with observeParent
  @property({type: String})
  public parentSelector = 'section';

  // anchor-IDs and their corresponding IntersectionObservers
  private anchorHashObserverMap!: Map<
    HTMLAnchorElement['hash'],
    IntersectionObserver
  >;
  /**
   * Selects a TOC link within the components slot / ul element.
   * Its id param is obtained by reading the oberver item's target-id.
   */
  private selectTocLink(id: string): HTMLAnchorElement | null {
    return this._tocList?.length
      ? this._tocList[0].querySelector<HTMLAnchorElement>(`[href="${id}"]`)
      : null;
  }
  /**
   * Receive any items within '_tocList' if present or null
   */
  private get _tocListItems(): HTMLAnchorElement[] | null {
    return this._tocList?.length
      ? [...this._tocList[0].querySelectorAll<HTMLAnchorElement>('[href]')]
      : null;
  }
  /**
   * Creates a map of anchor-IDs and their corresponding
   * IntersectionObservers. Anchor-IDs are used to select
   * toc-links within '_tocList' and also to create observer
   * items later.
   *
   * {"#beschreibung" => IntersectionObserver}
   * {"#lebensweise" => IntersectionObserver}
   */
  private createIdObserverMap(
    anchors: HTMLAnchorElement[],
  ): Map<HTMLAnchorElement['hash'], IntersectionObserver> {
    return new Map(
      anchors.map((anchor: HTMLAnchorElement) => {
        const {hash} = anchor;

        return [
          hash,
          new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => {
              entries.forEach((entry) => {
                if (entry.intersectionRatio > 0) {
                  this.selectTocLink(hash)?.classList.add(this.tocActiveClass);
                } else {
                  this.selectTocLink(hash)?.classList.remove(
                    this.tocActiveClass,
                  );
                }
              });
            },
            // IntersectionObserver options
            {
              root: this.ownerDocument.querySelector(this.rootElement!) || null,
            },
          ),
        ];
      }),
    );
  }
  /**
   * The 'firstUpdated' lifecycle is called after the component's DOM
   * has been updated the first time, immediately before updated() is called.
   * Only then an element's slot content (our toc items) is available and can be observed.
   */
  override firstUpdated(): void {

    // Observe items when at least one is available
    if (this._tocListItems?.length) {
      this.anchorHashObserverMap = this.createIdObserverMap(this._tocListItems);

      this.anchorHashObserverMap.forEach((observer, anchorHash) => {
        const item = this.ownerDocument?.querySelector(anchorHash);
        const observerItem =
          this.observeParent === false
            ? item!
            : item?.closest(this.parentSelector)!;

        observer.observe(observerItem!);
      });
    }
  }
  /**
   * Stop observing when the component is removed from the DOM
   */
  override disconnectedCallback(): void {
    // As there are no toc-items left to highlight observing
    // elements should be stopped
    this.anchorHashObserverMap.forEach((obs) => obs.disconnect());
  }

  override render() {
    return html`<slot name="toc"></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'toc-observer': TocObserver;
  }
}
