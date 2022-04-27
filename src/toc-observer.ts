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
  @queryAssignedElements({slot: 'toc', selector: 'ul'})
  private _tocList?: Array<HTMLUListElement>;
  
  // Identifies the element or document as a reference for interecting items
  @property({type: String})
  public rootElement?: string;
  
  // Selector for links within '_tocList'
  @property({type: String})
  public tocLinkSelector = '.toc-link';
  
  // CSS class which is set when observer items are visible
  @property({type: String})
  public tocActiveClass = 'toc-active';
  
  // Selector for items which will be observed (should be something with an id).
  @property({type: String})
  public observerItemSelector = 'section[id]';
  
  // Observes any items within your specified 'rootElement' and adds/removes a CSS class
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
      root: this.ownerDocument.querySelector(this.rootElement!) || null,
    },
  );
  /**
   * Selects a TOC link within the components slot / ul element.
   * Its id param is obtained by reading the oberver item's target-id.
   */
  private selectTocLink(id: string): HTMLAnchorElement | null {
    return this._tocList?.length
      ? this._tocList[0].querySelector<HTMLAnchorElement>(
          `${this.tocLinkSelector}[href="#${id}"]`,
        )
      : null;
  }
  /**
   * Receive any items within '_tocList' if present or null
   */
  private get _tocListItems(): HTMLAnchorElement[] | null {
    return this._tocList?.length
      ? Array.from(
          this._tocList[0].querySelectorAll<HTMLAnchorElement>(
            this.tocLinkSelector,
          ),
        )
      : null;
  }
  /**
   * The 'firstUpdated' lifecycle is called after the component's DOM
   * has been updated the first time, immediately before updated() is called.
   * Only then an element's slot content (our toc items) is available and can be observed.
   */
  override firstUpdated(): void {
    const observerItems = this.ownerDocument?.querySelectorAll<HTMLElement>(
      this.observerItemSelector,
    );
    // Observe items when at least one is available
    if (this._tocListItems?.length) {
      observerItems?.forEach((item) => this.observer.observe(item));
    }
  }
  /**
   * Stop observing when the component is removed from the DOM
   */
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
