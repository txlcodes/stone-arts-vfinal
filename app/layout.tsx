import type { Metadata } from "next";
import "../styles/normalize.css";
import "../styles/webflow.css";
import "../styles/stonearts-r-webshop.webflow.css";

export const metadata: Metadata = {
  title: "stonearts® Naturstein Akustikpaneele, Lamellenwand & Wandpaneele",
  description: "Entdecke die Vielfalt von handgefertigten Naturstein Akustikpaneelen, die Lärm reduzieren und eine gesunde Raumakustik mit Stil schaffen.",
  openGraph: {
    title: "stonearts® Naturstein Akustikpaneele, Lamellenwand & Wandpaneele",
    description: "Entdecke die Vielfalt von handgefertigten Naturstein Akustikpaneelen, die Lärm reduzieren und eine gesunde Raumakustik mit Stil schaffen.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "stonearts® Naturstein Akustikpaneele, Lamellenwand & Wandpaneele",
    description: "Entdecke die Vielfalt von handgefertigten Naturstein Akustikpaneelen, die Lärm reduzieren und eine gesunde Raumakustik mit Stil schaffen.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" data-wf-page="64ad4116e38ed7d405f77d2f" data-wf-site="64ad4116e38ed7d405f77d26">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="anonymous" />
        <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js" type="text/javascript"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `WebFont.load({  google: {    families: ["Playfair Display:regular,500,600,700,800,900"]  }});`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);`,
          }}
        />
        <link href="/images/favicon.jpg" rel="shortcut icon" type="image/x-icon" />
        <link href="/images/webclip.jpg" rel="apple-touch-icon" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
        .js-accordion-item, .js-accordion-header {
            -webkit-tap-highlight-color: transparent;
        }
        .js-link {
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
        }
        .js-accordion-body {
          display: none;
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          user-select: none;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(e,t){e[t]=new Proxy(e[t]||{},{get:(e,o)=>new Proxy(e[o]||function(){},{apply:(n,r,a)=>{const c=()=>e[o](...a);"complete"===document.readyState?c():document.addEventListener("readystatechange",(n=>{"complete"===n.target.readyState&&(e?.[o]?c():console.error(\`\${t}.\${o} is not a function. Did it load correctly from the CDN? If not, did you use the correct name.\`))}))}})})}(globalThis,"CodeCrumbs");`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "stonearts® GmbH-Münchendorf",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: 5.0,
                reviewCount: 13,
              },
            }),
          }}
        />
        <script src="https://embedsocial.com/cdn/rsh2.js"></script>
        <script src="https://code.jquery.com/jquery-3.6.0.min.js" defer></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css" />
        <script async src="https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsload@1/cmsload.js"></script>
      </head>
      <body>
        {children}
        <script src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=64ad4116e38ed7d405f77d26" type="text/javascript" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossOrigin="anonymous"></script>
        <script src="/js/webflow.js" type="text/javascript"></script>
        <script src="/js/cart-manager.js" type="text/javascript"></script>
        <script src="/js/populate-cms.js" type="text/javascript"></script>
        <script src="/js/add-to-cart-handler.js" type="text/javascript"></script>
        <script src="/js/button-click-fix.js" type="text/javascript"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (globalThis.CodeCrumbs = globalThis.CodeCrumbs || {}).QuantityButtons = function(options) {
            const {
              quantityGroupClass: groupClass = "q-group",
              quantityIncrementButtonClass: incClass = "q-inc",
              quantityDecrementButtonClass: decClass = "q-dec",
              quantityNumberFieldClass: numFieldClass = "q-num",
              disableDecrementAtOne: disableAtOne = true
            } = options;
            function updateDecrementButton(input, decButton) {
              const disable = disableAtOne && parseInt(input.value, 10) <= 1;
              decButton.toggleAttribute("disabled", disable);
              decButton.classList.toggle("disabled", disable);
            }
            function init() {
              document.querySelectorAll(\`.\${groupClass}\`).forEach(group => {
                const input = group.querySelector(\`.\${numFieldClass}\`);
                const decButton = group.querySelector(\`.\${decClass}\`);
                if (input && decButton) {
                  updateDecrementButton(input, decButton);
                }
              });
            }
            if (document.readyState !== "loading") {
              init();
            } else {
              document.addEventListener("DOMContentLoaded", init);
            }
            document.addEventListener("click", function(event) {
              let target = event.target;
              while (target && target.nodeType === Node.ELEMENT_NODE && (!target.classList || (!target.classList.contains(incClass) && !target.classList.contains(decClass)))) {
                target = target.parentNode;
              }
              if (target && target instanceof Element) {
                const group = target.closest(\`.\${groupClass}\`);
                const input = group.querySelector(\`.\${numFieldClass}\`);
                const decButton = group.querySelector(\`.\${decClass}\`);
                let value = parseInt(input.value, 10);
                if (target.classList.contains(incClass)) {
                  input.value = value + 1;
                } else if (target.classList.contains(decClass)) {
                  input.value = Math.max(value - 1, 1);
                }
                updateDecrementButton(input, decButton);
                input.dispatchEvent(new Event('change', { bubbles: true }));
              }
            });
            new MutationObserver((mutations) => {
              mutations.forEach(mutation => {
                if (mutation.type === "attributes" && mutation.attributeName === "value") {
                  init();
                }
              });
            }).observe(document, {
              attributes: true,
              subtree: true,
              attributeFilter: ["value"]
            });
          };
          document.addEventListener('DOMContentLoaded', function() {
            window.CodeCrumbs.QuantityButtons({
              quantityGroupClass: 'q-group',
              quantityIncrementButtonClass: 'q-inc',
              quantityDecrementButtonClass: 'q-dec',
              quantityNumberFieldClass: 'q-num',
              disableDecrementAtOne: true,
            });
          });
        `,
          }}
        />
        <script src="https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js" defer></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          $(document).ready(function() {
            $(".slider-main_component").each(function(index) {
              let loopMode = false;
              if ($(this).attr("loop-mode") === "true") {
                loopMode = true;
              }
              let sliderDuration = 300;
              if ($(this).attr("slider-duration") !== undefined) {
                sliderDuration = +$(this).attr("slider-duration");
              }
              const swiper = new Swiper($(this).find(".swiper")[0], {
                speed: sliderDuration,
                loop: loopMode,
                autoHeight: false,
                centeredSlides: false,
                followFinger: true,
                freeMode: false,
                slideToClickedSlide: false,
                slidesPerView: 1.3,
                spaceBetween: "4%",
                rewind: false,
                watchOverflow: true,
                // Touch/Swipe settings for mobile
                touchEventsTarget: 'container',
                touchStartPreventDefault: false,
                touchMoveStopPropagation: false,
                simulateTouch: true,
                allowTouchMove: true,
                touchRatio: 1,
                touchAngle: 45,
                grabCursor: true,
                mousewheel: {
                  forceToAxis: true
                },
                keyboard: {
                  enabled: false,
                  onlyInViewport: false
                },
                breakpoints: {
                  480: {
                    slidesPerView: 1,
                    spaceBetween: "3%"
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: "4%"
                  },
                  992: {
                    slidesPerView: 3.2,
                    spaceBetween: "1%"
                  }
                },
                pagination: {
                  el: $(this).find(".swiper-bullet-wrapper")[0],
                  bulletActiveClass: "is-active",
                  bulletClass: "swiper-bullet",
                  bulletElement: "button",
                  clickable: true
                },
                navigation: {
                  nextEl: $(this).find(".swiper-next")[0],
                  prevEl: $(this).find(".swiper-prev")[0],
                  disabledClass: "is-disabled"
                },
                scrollbar: {
                  el: $(this).find(".swiper-drag-wrapper")[0],
                  draggable: true,
                  dragClass: "swiper-drag",
                  snapOnRelease: true
                },
                slideActiveClass: "is-active",
                slideDuplicateActiveClass: "is-active"
              });
            });
          });
        `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          $(document).ready(function() {
            const accSettings = {
              speed: 300,
              oneOpen: true,
              offsetAnchor: true,
              offsetFromTop: 180,
              scrollTopDelay: 400,
              classes: {
                accordion: 'js-accordion',
                header: 'js-accordion-header',
                item: 'js-accordion-item',
                body: 'js-accordion-body',
                icon: 'js-accordion-icon',
                active: 'active',
              }
            };
            const prefix = accSettings.classes;
            const accordionElem = $(\`.\${prefix.accordion}\`);
            const accordionHeader = accordionElem.find(\`.\${prefix.header}\`);
            const accordionItem = $(\`.\${prefix.item}\`);
            const accordionBody = $(\`.\${prefix.body}\`);
            const accordionIcon = $(\`.\${prefix.icon}\`);
            const activeClass = prefix.active;
            const accordion = {
              init: function(settings) {
                $.extend(accSettings, settings);
                accordionHeader.on('click', function() {
                  accordion.toggle($(this));
                  if (accSettings.offsetAnchor) {
                    setTimeout(() => {
                      $('html, body').animate({
                        scrollTop: $(this).offset().top - accSettings.offsetFromTop
                      }, accSettings.speed);
                    }, accSettings.scrollTopDelay);
                  }
                });
                if (accSettings.oneOpen && $(\`.\${prefix.item}.\${activeClass}\`).length > 1) {
                  $(\`.\${prefix.item}.\${activeClass}:not(:first)\`).removeClass(activeClass).find(\`.\${prefix.header} > .\${prefix.icon}\`).removeClass(activeClass);
                }
                $(\`.\${prefix.item}.\${activeClass}\`).find(\`> .\${prefix.body}\`).show();
              },
              toggle: function($this) {
                if (accSettings.oneOpen && $this[0] != $this.closest(accordionElem).find(\`> .\${prefix.item}.\${activeClass} > .\${prefix.header}\`)[0]) {
                  $this.closest(accordionElem).find(\`> .\${prefix.item}\`).removeClass(activeClass).find(accordionBody).slideUp(accSettings.speed);
                  $this.closest(accordionElem).find(\`> .\${prefix.item}\`).find(\`> .\${prefix.header} > .\${prefix.icon}\`).removeClass(activeClass);
                }
                $this.closest(accordionItem).toggleClass(\`\${activeClass}\`).find(\`> .\${prefix.header} > .\${prefix.icon}\`).toggleClass(activeClass);
                $this.next().stop().slideToggle(accSettings.speed);
              }
            };
            accordion.init(accSettings);
          });
        `,
          }}
        />
      </body>
    </html>
  );
}
