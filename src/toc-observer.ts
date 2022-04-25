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

import {LitElement, html, css} from 'lit';
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
  static override styles = css`
    :host {
      display: block;
      --base-gap: 16px;
    }
  `;

  @property({type: String})
  public rootElement = 'null';

  @property({type: Array})
  public threshold: number[] = [0.0, 1.0];

  @property({type: String})
  public tocLinkSelector = '.toc-link';

  @property({type: String})
  public tocActiveClass = 'toc-active';

  @property({type: String})
  public observerItemSelector = 'h2[id], h3[id]';

  @queryAssignedElements({slot: 'toc', selector: 'ul'})
  private _tocList!: Array<HTMLUListElement>;

  private observerItems: NodeListOf<HTMLElement> =
    this.ownerDocument?.querySelectorAll<HTMLElement>(
      this.observerItemSelector,
    );

  private observer: IntersectionObserver = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const {id} = entry.target;

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

  public selectTocLink(id: string): HTMLAnchorElement | null {
    return (
      this.ownerDocument?.querySelector<HTMLAnchorElement>(
        `${this.tocLinkSelector}[href="#${id}"]`,
      ) ?? null
    );
  }

  get _tocListItems(): HTMLAnchorElement[] {
    let tocLinks: HTMLAnchorElement[] = [];
    if (this._tocList?.length) {
      tocLinks = Array.from(
        this._tocList[0].querySelectorAll(this.tocLinkSelector),
      );
    }

    return tocLinks;
  }

  override firstUpdated(): void {
    const tocListItems: HTMLAnchorElement[] = this._tocListItems;

    if (tocListItems.length === 0) {
      console.log('empty');
      const headings = this.observerItems;
      console.log(headings);
    }

    console.log(tocListItems.length);

    const hashes: string = tocListItems
      .map((tocListItem) => tocListItem.hash)
      .toString();

    // const headings: NodeListOf<HTMLElement> =
    //   this.ownerDocument?.querySelectorAll(hashes);

    console.log(tocListItems);
    console.log({hashes});

    this.observerItems.forEach((item) => this.observer.observe(item));
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
