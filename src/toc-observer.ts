/**
 * <toc-observer> highlights the current heading in your
 * table of contents
 *
 * Copyright © 2022 Tony Spegel
 */

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
 * Observes your TOC elements.
 *
 * @slot - This element has a slot
 */
@customElement('toc-observer')
export class TocObserver extends LitElement {
  @property({type: String})
  public rootElement = 'null';

  @property({type: Array})
  public threshold: number[] = [0, 1];

  @property({type: String})
  public tocLinkSelector = '.toc-link';

  @property({type: String})
  public tocActiveClass = 'toc-active';

  @property({type: String})
  public observerItemSelector = 'h2[id], h3[id]';

  @queryAssignedElements({slot: 'toc', selector: 'ul'})
  private _tocList!: Array<HTMLUListElement>;

  private observer: IntersectionObserver = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        // Get the id of the intersecting item
        const {id} = entry.target;
        // If any item intersects with our root add / remove a CSS class
        if (entry.intersectionRatio > 0) {
          this.selectTocLink(id)?.classList.add(this.tocActiveClass);
        } else {
          this.selectTocLink(id)?.classList.remove(this.tocActiveClass);
        }
      });
    },
    // IntersectionObserver options
    {
      root: this.ownerDocument.querySelector(this.rootElement),
      threshold: this.threshold,
    },
  );
  /**
   * Selects a TOC link within the components slot / ul element.
   * Its id param is obtained by reading the oberver item's target-id.
   */
  private selectTocLink(id: string): HTMLAnchorElement | null {
    return this._tocList[0].querySelector<HTMLAnchorElement>(
      `${this.tocLinkSelector}[href="#${id}"]`,
    );
  }

  private get _tocListItems(): HTMLAnchorElement[] | null {
    return this._tocList?.length
      ? Array.from(
          this._tocList[0].querySelectorAll<HTMLAnchorElement>(
            this.tocLinkSelector,
          ),
        )
      : null;
  }

  override firstUpdated(): void {
    const observerItems = this.ownerDocument?.querySelectorAll<HTMLElement>(
      this.observerItemSelector,
    );

    if (this._tocListItems?.length) {
      observerItems?.forEach((item) => this.observer.observe(item));
    }
  }

  override disconnectedCallback(): void {
    this.observer.disconnect();
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
