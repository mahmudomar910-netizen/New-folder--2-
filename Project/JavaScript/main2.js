  /* Final consolidated script — drop this into your <script> (replace old script) */
        document.addEventListener('DOMContentLoaded', () => {

            /*************** HAMBURGER *****************/
            const hamburger = document.querySelector('.hamburger');
            const navLinks = document.querySelector('.nav-links');

            if (hamburger && navLinks) {
                hamburger.addEventListener('click', () => {
                    navLinks.classList.toggle('active');

                    // When opening hamburger, clear any desktop-only opens so mobile doesn't show them
                    if (navLinks.classList.contains('active')) {
                        document.querySelectorAll('.has-dropdown, .has-submenu').forEach(el => {
                            el.classList.remove('open', 'clicked');
                        });
                    } else {
                        // when closing hamburger, close mobile dropdowns & submenus
                        document.querySelectorAll('.has-dropdown, .has-submenu').forEach(el => {
                            el.classList.remove('active');
                        });
                    }
                });
            }

            /**************** SCROLLING (unchanged) ****************/
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

            /**************** DROPDOWNS + SUBMENUS ****************/
            const dropdownItems = Array.from(document.querySelectorAll('.has-dropdown'));
            const submenuItems = Array.from(document.querySelectorAll('.has-submenu'));
            const CLOSE_DELAY = 220; // ms

            function closeAllDropdowns() {
                dropdownItems.forEach(i => i.classList.remove('clicked', 'open', 'active'));
                submenuItems.forEach(s => s.classList.remove('clicked', 'open', 'active'));
            }

            // Helper to detect "mobile mode" (hamburger open OR narrow viewport)
            function isMobileMode() {
                return (navLinks && navLinks.classList.contains('active')) || window.innerWidth <= 784;
            }

            /* ---------- Top-level dropdowns ---------- */
            dropdownItems.forEach(item => {
                const trigger = item.querySelector(':scope > a'); // top-level anchor
                const menu = item.querySelector('.dropdown');
                let closeTimer = null;

                function openNow() {
                    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
                    item.classList.add('open');
                }
                function scheduleClose() {
                    if (closeTimer) clearTimeout(closeTimer);
                    closeTimer = setTimeout(() => {
                        if (!item.classList.contains('clicked')) item.classList.remove('open');
                    }, CLOSE_DELAY);
                }

                // Desktop hover (but only if not in mobile mode)
                item.addEventListener('mouseenter', () => {
                    if (!isMobileMode() && !item.classList.contains('clicked')) openNow();
                });
                item.addEventListener('mouseleave', () => {
                    if (!isMobileMode() && !item.classList.contains('clicked')) scheduleClose();
                });

                if (menu) {
                    menu.addEventListener('mouseenter', () => {
                        if (!isMobileMode()) { if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; } }
                    });
                    menu.addEventListener('mouseleave', () => {
                        if (!isMobileMode() && !item.classList.contains('clicked')) scheduleClose();
                    });
                }

                // Click behaviour: desktop click opens persistently; mobile mode toggles mobile state
                if (trigger) {
                    trigger.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        // Desktop click (persistent)
                        if (!isMobileMode()) {
                            const wasClicked = item.classList.contains('clicked');
                            closeAllDropdowns(); // close everything first
                            if (!wasClicked) item.classList.add('clicked', 'open');
                            return;
                        }

                        // Mobile click (inside hamburger) -> toggle this dropdown's mobile state
                        if (isMobileMode()) {
                            // close other mobile dropdowns
                            dropdownItems.forEach(i => { if (i !== item) i.classList.remove('active'); });
                            item.classList.toggle('active');
                            // when toggling mobile dropdown, also clear desktop-only open
                            item.classList.remove('open', 'clicked');
                        }
                    });
                }

                // Ensure desktop-only states cleared on resize into mobile and vice versa
                window.addEventListener('resize', () => {
                    if (window.innerWidth <= 784) {
                        item.classList.remove('open', 'clicked');
                    } else {
                        item.classList.remove('active');
                    }
                });
            });

            /* ---------- Submenus (has-submenu) ---------- */
            submenuItems.forEach(sub => {
                const trigger = sub.querySelector(':scope > a');
                const submenu = sub.querySelector('.submenu');

                let closeTimer = null;
                function scheduleSubClose() {
                    if (closeTimer) clearTimeout(closeTimer);
                    closeTimer = setTimeout(() => {
                        if (!sub.classList.contains('clicked')) sub.classList.remove('open');
                    }, CLOSE_DELAY);
                }
                function cancelSubClose() { if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; } }

                // Hover (desktop only and only when top-level isn't in mobile mode)
                sub.addEventListener('mouseenter', () => {
                    if (!isMobileMode() && !sub.classList.contains('clicked')) sub.classList.add('open');
                });
                sub.addEventListener('mouseleave', () => {
                    if (!isMobileMode() && !sub.classList.contains('clicked')) scheduleSubClose();
                });

                if (submenu) {
                    submenu.addEventListener('mouseenter', cancelSubClose);
                    submenu.addEventListener('mouseleave', () => {
                        if (!isMobileMode() && !sub.classList.contains('clicked')) scheduleSubClose();
                    });
                }

                // Click toggles persistent open/close (desktop & mobile)
                if (trigger) {
                    trigger.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        const wasActive = sub.classList.contains('active');

                        // Close sibling submenus (within same dropdown) first
                        const parentDropdown = sub.closest('.dropdown') || sub.closest('.has-dropdown') || document;
                        const siblingSubmenus = Array.from(parentDropdown.querySelectorAll('.has-submenu'));
                        siblingSubmenus.forEach(s => { if (s !== sub) s.classList.remove('active', 'open', 'clicked'); });

                        if (!wasActive) {
                            sub.classList.add('active', 'clicked', 'open');
                        } else {
                            sub.classList.remove('active', 'clicked', 'open');
                        }
                    });
                }

                // Clear states on resize
                window.addEventListener('resize', () => {
                    if (window.innerWidth <= 784) {
                        sub.classList.remove('open', 'clicked');
                    } else {
                        sub.classList.remove('active');
                    }
                });
            });

            /******** GLOBAL CLOSE ********/
            // Click outside the navbar closes everything
            document.addEventListener('click', (e) => {
                const insideNav = e.target.closest('.navbar') || e.target.closest('.nav-links');
                if (!insideNav) closeAllDropdowns();
            });

            // Escape key closes everything
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeAllDropdowns();
            });

        });
