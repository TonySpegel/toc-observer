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

const tocIntersectionObserver = (
  options?: IntersectionObserverInit,
): IntersectionObserver => {
  return new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      document
        ?.querySelectorAll('.toc-link')
        .forEach((tocLink) => tocLink.removeAttribute('aria-current'));

      if (entry.isIntersecting) {
        const {target} = entry;
        console.log(entry.isIntersecting);
        console.log(entry);
        console.log(target.id);

        document
          ?.querySelector(`a[href='#${target.id}']`)
          ?.setAttribute('aria-current', 'true');
      }
    });
  }, options);
};

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
  public rootElement = 'header';

  @property({type: String})
  public rootMargin = '30px';

  @property({type: Array})
  public threshold: number[] = [0.0, 1.0];

  @queryAssignedElements({slot: 'toc', selector: 'ul'})
  _tocList!: Array<HTMLUListElement>;

  private observer: IntersectionObserver = tocIntersectionObserver({
    root: this.ownerDocument.querySelector('body > header'),
    threshold: this.threshold,
  });

  get _tocListItems(): HTMLAnchorElement[] {
    let tocLinks: HTMLAnchorElement[] = [];
    if (this._tocList?.length) {
      tocLinks = Array.from(this._tocList[0].querySelectorAll('.toc-link'));
    }

    return tocLinks;
  }

  override firstUpdated(): void {
    const tocListItems: HTMLAnchorElement[] = this._tocListItems;

    const hashes: string = tocListItems
      .map((tocListItem) => tocListItem.hash)
      .toString();

    const headings: NodeListOf<HTMLElement> =
      this.ownerDocument?.querySelectorAll(hashes);

    console.log(tocListItems);
    console.log({hashes});

    headings.forEach((item) => this.observer.observe(item));
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
