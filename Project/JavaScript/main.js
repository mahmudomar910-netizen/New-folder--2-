        /* --------------------
           Consolidated JS
           - single DOMContentLoaded
           - delayed close to allow crossing the gap
           - hover (temporary) + click (toggle/persistent)
           - click outside closes all
           - mobile hamburger dropdown fixes
           -------------------- */
        document.addEventListener('DOMContentLoaded', () => {

            /*************** HAMBURGER *****************/
            /* ----- hamburger (single binding) ----- */
            const hamburger = document.querySelector('.hamburger');
            const navLinks = document.querySelector('.nav-links');
            if (hamburger && navLinks) {
                hamburger.addEventListener('click', () => {
                    navLinks.classList.toggle('active');

                    // Close all mobile dropdowns when hamburger closes
                    if (!navLinks.classList.contains('active')) {
                        document.querySelectorAll('.has-dropdown').forEach(item => item.classList.remove('active'));
                    }
                });
            }


            /**************** SCROLLING **********************/
            /* ----- IntersectionObserver for animations ----- */
            const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
            const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 };

            const observer = new IntersectionObserver((entries, observerInstance) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observerInstance.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            elementsToAnimate.forEach(el => observer.observe(el));


            /**************** DROPDOWN ****************/
            /* ----- Dropdown logic (robust) ----- */
            const dropdownItems = document.querySelectorAll('.has-dropdown');
            const CLOSE_DELAY = 220; // ms - small grace period to cross gap

            dropdownItems.forEach(item => {
                const trigger = item.querySelector('a');
                const menu = item.querySelector('.dropdown');
                let closeTimer = null;

                function openNow() {
                    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
                    item.classList.add('open');
                }

                function scheduleClose() {
                    if (closeTimer) clearTimeout(closeTimer);
                    closeTimer = setTimeout(() => {
                        if (!item.classList.contains('clicked')) {
                            item.classList.remove('open');
                        }
                    }, CLOSE_DELAY);
                }

                function cancelClose() {
                    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
                }

                // Desktop hover (only when not in mobile menu)
                item.addEventListener('mouseenter', () => {
                    if (window.innerWidth > 783 && !item.classList.contains('clicked')) {
                        openNow();
                    }
                });
                item.addEventListener('mouseleave', () => {
                    if (window.innerWidth > 783 && !item.classList.contains('clicked')) {
                        scheduleClose();
                    }
                });

                if (menu) {
                    menu.addEventListener('mouseenter', () => {
                        if (window.innerWidth > 783) cancelClose();
                    });
                    menu.addEventListener('mouseleave', () => {
                        if (window.innerWidth > 783 && !item.classList.contains('clicked')) scheduleClose();
                    });
                }

                // Keyboard accessibility (desktop)
                if (trigger) {
                    trigger.addEventListener('focus', () => {
                        if (window.innerWidth > 783) openNow();
                    });
                    trigger.addEventListener('blur', () => {
                        if (window.innerWidth > 783 && !item.classList.contains('clicked')) scheduleClose();
                    });

                    // Click toggles persistent open/close
                    trigger.addEventListener('click', (e) => {
                        e.preventDefault(); // stop navigation
                        const wasClicked = item.classList.contains('clicked');

                        // Close all others
                        dropdownItems.forEach(i => i.classList.remove('clicked', 'open'));

                        if (!wasClicked) {
                            item.classList.add('clicked', 'open');
                        }
                    });
                }

                // MOBILE dropdown click (hamburger only)
                // MOBILE dropdown click (hamburger only)
                if (trigger) {
                    trigger.addEventListener('click', (e) => {
                        if (window.innerWidth <= 783 && navLinks.classList.contains('active')) {
                            e.preventDefault(); // prevent page navigation
                            item.classList.toggle('active'); // toggle only mobile state
                            item.classList.remove('open');   // remove desktop hover state if present
                        }
                    });
                }


                window.addEventListener('resize', () => {
                    if (window.innerWidth <= 783) {
                        item.classList.remove('open'); // clear desktop-only temporary opens
                    }
                });
            });

            // Click outside closes all dropdowns
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.has-dropdown')) {
                    dropdownItems.forEach(i => i.classList.remove('clicked', 'open', 'active'));
                }
            });

            // Escape key closes everything
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    dropdownItems.forEach(i => i.classList.remove('clicked', 'open', 'active'));
                }
            });

        });
