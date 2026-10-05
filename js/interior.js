/**
 * UrbanNest Interiors - Interactive Application Script
 * Features:
 * 1. render.ai Before/After B&W to Color Comparison Slider
 * 2. 3D Wall Studio Configurator (Colors, Designs, Tiles, Lighting, Accents, Cost)
 * 3. DesignCafe Style Cost Estimator (1BHK, 2BHK, 3BHK, 4BHK + Customer Details)
 * 4. Theme & Accent Customizer (Light/Dark + Red, Indigo, Emerald, Amber)
 * 5. Showcase Filter & Fullscreen Lightbox
 * 6. Mobile Sidebar Toggle & Active Nav Highlighting
 * 7. Interactive FAQ Accordion & Booking Notifications
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeSwitcher();
    initMobileNav();
    initActiveNavScroll();
    initRenderAiSlider();
    initWallStudio();
    initCostEstimator();
    initGalleryFiltersAndLightbox();
    initFaqAccordion();
    initContactForms();
});

/* ==========================================================================
   1. THEME SWITCHER (Dark/Light Mode & Brand Accent Colors)
   ========================================================================== */
function initThemeSwitcher() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    const colorSwatches = document.querySelectorAll('.accent-swatch');

    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('urbannest-theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
        if (themeText) themeText.textContent = 'Light Mode';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('urbannest-theme', isDark ? 'dark' : 'light');
            if (themeIcon) themeIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            if (themeText) themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
            showToast(isDark ? 'Dark theme enabled' : 'Light theme enabled', 'info');
        });
    }

    // Load saved accent color or default to original red (#f44336)
    const savedAccent = localStorage.getItem('urbannest-accent') || '#f44336';
    applyAccentColor(savedAccent);

    colorSwatches.forEach(swatch => {
        const color = swatch.getAttribute('data-color');
        if (color === savedAccent) swatch.classList.add('active');

        swatch.addEventListener('click', () => {
            colorSwatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            applyAccentColor(color);
            localStorage.setItem('urbannest-accent', color);
            showToast(`Accent updated to ${swatch.getAttribute('title') || color}`, 'success');
        });
    });
}

function applyAccentColor(color) {
    document.documentElement.style.setProperty('--primary-color', color);
}

/* ==========================================================================
   2. MOBILE SIDEBAR NAVIGATION & SMOOTH SCROLLING
   ========================================================================== */
function initMobileNav() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            if (overlay) overlay.classList.toggle('active');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992 && sidebar) {
                sidebar.classList.remove('open');
                if (overlay) overlay.classList.remove('active');
            }
        });
    });
}

function initActiveNavScroll() {
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.sidebar-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   3. RENDER.AI BLACK & WHITE TO COLOR COMPARISON SLIDER
   ========================================================================== */
const renderSpaces = {
    townhouse: {
        title: "Townhouse / Living Area",
        bwImage: "./images/livingroom (1).jpg",
        colorImage: "./images/livingroom (1).jpg",
        defaultFinish: "Limestone",
        description: "Explore the contrast between pure architectural form and finished material warmth."
    },
    kitchen: {
        title: "Island Kitchen / Concrete & Walnut",
        bwImage: "./images/kitchenconcrete (1).jpg",
        colorImage: "./images/kitchenconcrete (1).jpg",
        defaultFinish: "Concrete & Quartz",
        description: "From structural clay draft to high-gloss modular surfaces and ambient cove illumination."
    },
    bedroom: {
        title: "Master Suite / Scandinavian Minimal",
        bwImage: "./images/bedroom.jpg",
        colorImage: "./images/bedroom.jpg",
        defaultFinish: "Natural Oak",
        description: "Notice how soft diffused lighting brings out rich textile and timber textures."
    },
    atrium: {
        title: "Double-Height Atrium / Marble Foyer",
        bwImage: "./images/atrium.jpg",
        colorImage: "./images/atrium.jpg",
        defaultFinish: "Carrara Marble",
        description: "Monochrome volume vs dramatic architectural skylight and reflective stonework."
    },
    dining: {
        title: "Contemporary Dining / Warm Walnut",
        bwImage: "./images/diningroom.jpg",
        colorImage: "./images/diningroom.jpg",
        defaultFinish: "Walnut & Brass",
        description: "Examine how pendant accent lighting defines the social dining centerpiece."
    }
};

const finishFilters = {
    limestone: {
        name: "Limestone",
        filter: "contrast(1.05) saturate(1.1) brightness(1.02) sepia(0.08)"
    },
    oak: {
        name: "Scandinavian Oak",
        filter: "contrast(1.08) saturate(1.25) brightness(1.05) sepia(0.18)"
    },
    marble: {
        name: "Carrara Marble",
        filter: "contrast(1.2) saturate(1.05) brightness(1.08) hue-rotate(-5deg)"
    },
    charcoal: {
        name: "Nordic Charcoal",
        filter: "contrast(1.3) saturate(0.9) brightness(0.9) hue-rotate(190deg)"
    },
    terracotta: {
        name: "Modern Terracotta",
        filter: "contrast(1.15) saturate(1.35) brightness(1.02) sepia(0.25) hue-rotate(-15deg)"
    }
};

function initRenderAiSlider() {
    const container = document.getElementById('render-slider-container');
    const colorLayer = document.getElementById('render-color-layer');
    const sliderHandle = document.getElementById('render-slider-handle');
    const breadcrumbSpace = document.getElementById('render-space-breadcrumb');
    const breadcrumbFinish = document.getElementById('render-finish-breadcrumb');
    const roomItems = document.querySelectorAll('.render-room-item');
    const finishChips = document.querySelectorAll('.finish-chip');
    const bwImg = document.getElementById('render-bw-img');
    const colorImg = document.getElementById('render-color-img');
    const sweepBtn = document.getElementById('render-sweep-btn');
    const viewButtons = document.querySelectorAll('[data-render-view]');

    if (!container || !colorLayer || !sliderHandle) return;

    let isDragging = false;
    let currentPosition = 50; // percentage
    let currentSpaceKey = 'townhouse';
    let currentFinishKey = 'limestone';
    let sweepInterval = null;

    function updateSlider(percent) {
        percent = Math.max(0, Math.min(100, percent));
        currentPosition = percent;
        sliderHandle.style.left = `${percent}%`;
        colorLayer.style.clipPath = `polygon(${percent}% 0%, 100% 0%, 100% 100%, ${percent}% 100%)`;
    }

    function onPointerMove(e) {
        if (!isDragging) return;
        const rect = container.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const offsetX = clientX - rect.left;
        const percent = (offsetX / rect.width) * 100;
        updateSlider(percent);
    }

    function startDragging(e) {
        isDragging = true;
        container.classList.add('dragging');
        if (sweepInterval) {
            clearInterval(sweepInterval);
            sweepInterval = null;
            if (sweepBtn) sweepBtn.classList.remove('active');
        }
        onPointerMove(e);
    }

    function stopDragging() {
        if (isDragging) {
            isDragging = false;
            container.classList.remove('dragging');
        }
    }

    // Mouse and Touch Listeners on the container
    container.addEventListener('mousedown', startDragging);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', stopDragging);

    container.addEventListener('touchstart', startDragging, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', stopDragging);

    // Initial position
    updateSlider(50);

    // Room Switcher
    roomItems.forEach(item => {
        item.addEventListener('click', () => {
            roomItems.forEach(r => r.classList.remove('active'));
            item.classList.add('active');

            const spaceKey = item.getAttribute('data-space');
            if (renderSpaces[spaceKey]) {
                currentSpaceKey = spaceKey;
                const space = renderSpaces[spaceKey];
                if (bwImg) bwImg.src = space.bwImage;
                if (colorImg) colorImg.src = space.colorImage;
                if (breadcrumbSpace) breadcrumbSpace.textContent = space.title.split('/')[0].trim();
                showToast(`Loaded ${space.title}`, 'info');
            }
        });
    });

    // Finish Switcher
    finishChips.forEach(chip => {
        chip.addEventListener('click', () => {
            finishChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const finishKey = chip.getAttribute('data-finish');
            if (finishFilters[finishKey]) {
                currentFinishKey = finishKey;
                const finish = finishFilters[finishKey];
                if (colorImg) {
                    colorImg.style.filter = finish.filter;
                }
                if (breadcrumbFinish) breadcrumbFinish.textContent = finish.name;
                showToast(`Material finish applied: ${finish.name}`, 'success');
            }
        });
    });

    // Auto-sweep demonstration
    if (sweepBtn) {
        sweepBtn.addEventListener('click', () => {
            if (sweepInterval) {
                clearInterval(sweepInterval);
                sweepInterval = null;
                sweepBtn.classList.remove('active');
                return;
            }

            sweepBtn.classList.add('active');
            let direction = 1;
            let pos = currentPosition;
            sweepInterval = setInterval(() => {
                pos += direction * 0.8;
                if (pos >= 90) direction = -1;
                if (pos <= 10) direction = 1;
                updateSlider(pos);
            }, 25);
        });
    }

    // View preset buttons (Full B&W, Split 50/50, Full Color)
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (sweepInterval) {
                clearInterval(sweepInterval);
                sweepInterval = null;
                if (sweepBtn) sweepBtn.classList.remove('active');
            }
            const view = btn.getAttribute('data-render-view');
            if (view === 'bw') updateSlider(100);
            else if (view === 'color') updateSlider(0);
            else if (view === 'split') updateSlider(50);
        });
    });
}

/* ==========================================================================
   4. 3D WALL STUDIO CONFIGURATOR
   ========================================================================== */
function initWallStudio() {
    const wallStage = document.getElementById('wall-stage-surface');
    const wallPerspectiveContainer = document.getElementById('wall-3d-perspective-container');
    const colorSwatches = document.querySelectorAll('.wall-color-swatch');
    const customColorInput = document.getElementById('wall-custom-color');
    const designOptions = document.querySelectorAll('.wall-design-option');
    const tileOptions = document.querySelectorAll('.wall-tile-option');
    const lightingOptions = document.querySelectorAll('.wall-lighting-option');
    const accentToggles = document.querySelectorAll('.wall-accent-toggle');
    const widthSlider = document.getElementById('wall-width-slider');
    const heightSlider = document.getElementById('wall-height-slider');
    const widthDisplay = document.getElementById('wall-width-val');
    const heightDisplay = document.getElementById('wall-height-val');
    const areaDisplay = document.getElementById('wall-area-val');
    const costDisplay = document.getElementById('wall-cost-val');
    const saveDesignBtn = document.getElementById('wall-save-design-btn');
    const applyToQuoteBtn = document.getElementById('wall-apply-to-quote-btn');
    const angleButtons = document.querySelectorAll('[data-wall-angle]');

    if (!wallStage) return;

    let wallState = {
        type: 'paint', // 'paint', 'design', 'tile'
        color: '#f44336',
        patternClass: '',
        tileClass: '',
        lightingClass: 'lighting-daylight',
        width: 12,
        height: 10,
        ratePerSqFt: 6, // base paint rate
        accents: {
            shelves: true,
            art: true,
            sconces: true,
            baseboard: true,
            strip: false
        }
    };

    function updateWallRender() {
        // Clear old texture/tile classes
        const classesToRemove = Array.from(wallStage.classList).filter(c => 
            c.startsWith('wall-pattern-') || c.startsWith('wall-tile-')
        );
        classesToRemove.forEach(c => wallStage.classList.remove(c));

        if (wallState.type === 'paint') {
            wallStage.style.backgroundColor = wallState.color;
            wallStage.style.backgroundImage = 'none';
        } else if (wallState.type === 'design') {
            wallStage.style.backgroundColor = wallState.color;
            if (wallState.patternClass) {
                wallStage.classList.add(wallState.patternClass);
            }
        } else if (wallState.type === 'tile') {
            wallStage.style.backgroundColor = 'transparent';
            if (wallState.tileClass) {
                wallStage.classList.add(wallState.tileClass);
            }
        }

        // Lighting
        if (wallPerspectiveContainer) {
            const lightClasses = ['lighting-daylight', 'lighting-warm', 'lighting-spotlight', 'lighting-night'];
            lightClasses.forEach(c => wallPerspectiveContainer.classList.remove(c));
            wallPerspectiveContainer.classList.add(wallState.lightingClass);
        }

        // Accents
        Object.keys(wallState.accents).forEach(acc => {
            const el = document.getElementById(`wall-element-${acc}`);
            if (el) {
                el.style.display = wallState.accents[acc] ? 'block' : 'none';
            }
        });

        // Sconce glowing effect if night or warm mode
        const sconceGlow = document.querySelectorAll('.sconce-light-beam');
        const isDarkLighting = wallState.lightingClass === 'lighting-night' || wallState.lightingClass === 'lighting-warm';
        sconceGlow.forEach(beam => {
            beam.style.opacity = (isDarkLighting && wallState.accents.sconces) ? '0.85' : '0.2';
        });

        calculateCost();
    }

    function calculateCost() {
        const area = wallState.width * wallState.height;
        let baseRate = 5; // paint $/sqft

        if (wallState.type === 'design') {
            baseRate = 12; // designer wallpaper / acoustic slats
        } else if (wallState.type === 'tile') {
            baseRate = 22; // premium stone/marble/subway tiles
        }

        let accentCost = 0;
        if (wallState.accents.shelves) accentCost += 80;
        if (wallState.accents.art) accentCost += 60;
        if (wallState.accents.sconces) accentCost += 110;
        if (wallState.accents.baseboard) accentCost += 40;
        if (wallState.accents.strip) accentCost += 75;

        const totalCost = (area * baseRate) + accentCost;

        if (widthDisplay) widthDisplay.textContent = `${wallState.width} ft`;
        if (heightDisplay) heightDisplay.textContent = `${wallState.height} ft`;
        if (areaDisplay) areaDisplay.textContent = `${area} sq.ft`;
        if (costDisplay) costDisplay.textContent = `$${totalCost.toLocaleString()}`;

        wallState.currentTotalCost = totalCost;
    }

    // Color Swatches
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            colorSwatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            const color = swatch.getAttribute('data-color');
            wallState.type = 'paint';
            wallState.color = color;
            if (customColorInput) customColorInput.value = color;

            // de-activate tile options
            tileOptions.forEach(t => t.classList.remove('active'));
            updateWallRender();
        });
    });

    if (customColorInput) {
        customColorInput.addEventListener('input', (e) => {
            wallState.type = 'paint';
            wallState.color = e.target.value;
            colorSwatches.forEach(s => s.classList.remove('active'));
            tileOptions.forEach(t => t.classList.remove('active'));
            updateWallRender();
        });
    }

    // Wallpaper / Design Options
    designOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            designOptions.forEach(d => d.classList.remove('active'));
            opt.classList.add('active');
            tileOptions.forEach(t => t.classList.remove('active'));

            const pattern = opt.getAttribute('data-pattern');
            wallState.type = 'design';
            wallState.patternClass = `wall-pattern-${pattern}`;
            updateWallRender();
            showToast(`Wall texture applied: ${opt.querySelector('span')?.textContent || pattern}`, 'info');
        });
    });

    // Tile Options
    tileOptions.forEach(tile => {
        tile.addEventListener('click', () => {
            tileOptions.forEach(t => t.classList.remove('active'));
            tile.classList.add('active');
            designOptions.forEach(d => d.classList.remove('active'));
            colorSwatches.forEach(s => s.classList.remove('active'));

            const tileType = tile.getAttribute('data-tile');
            wallState.type = 'tile';
            wallState.tileClass = `wall-tile-${tileType}`;
            updateWallRender();
            showToast(`Wall cladding applied: ${tile.querySelector('span')?.textContent || tileType}`, 'success');
        });
    });

    // Lighting Mode Options
    lightingOptions.forEach(light => {
        light.addEventListener('click', () => {
            lightingOptions.forEach(l => l.classList.remove('active'));
            light.classList.add('active');

            const mode = light.getAttribute('data-lighting');
            wallState.lightingClass = `lighting-${mode}`;
            updateWallRender();
        });
    });

    // Accents Toggles
    accentToggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            const acc = toggle.getAttribute('data-accent');
            if (acc && wallState.accents.hasOwnProperty(acc)) {
                wallState.accents[acc] = toggle.checked;
                updateWallRender();
            }
        });
    });

    // Dimensions
    if (widthSlider) {
        widthSlider.addEventListener('input', (e) => {
            wallState.width = parseInt(e.target.value, 10);
            updateWallRender();
        });
    }

    if (heightSlider) {
        heightSlider.addEventListener('input', (e) => {
            wallState.height = parseInt(e.target.value, 10);
            updateWallRender();
        });
    }

    // 3D Angle view toggle
    angleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            angleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const angle = btn.getAttribute('data-wall-angle');
            if (wallPerspectiveContainer) {
                wallPerspectiveContainer.className = wallPerspectiveContainer.className
                    .replace(/\bangle-\S+/g, '')
                    .trim();
                wallPerspectiveContainer.classList.add(`angle-${angle}`);
            }
        });
    });

    // Save & Quote Buttons
    if (saveDesignBtn) {
        saveDesignBtn.addEventListener('click', () => {
            showToast('3D Wall Design saved to your session portfolio!', 'success');
        });
    }

    if (applyToQuoteBtn) {
        applyToQuoteBtn.addEventListener('click', () => {
            const estimatorSection = document.getElementById('cost-estimator');
            if (estimatorSection) {
                estimatorSection.scrollIntoView({ behavior: 'smooth' });
                showToast(`Applied ${wallState.width}x${wallState.height}ft Custom Wall to Cost Estimator`, 'success');
            }
        });
    }

    // Initial render
    updateWallRender();
}

/* ==========================================================================
   5. DESIGNCAFE STYLE INSTANT COST ESTIMATOR (1 BHK / 2 BHK / 3 BHK / 4 BHK)
   ========================================================================== */
function initCostEstimator() {
    const flatPills = document.querySelectorAll('.flat-pill');
    const roomCheckboxes = document.querySelectorAll('.room-scope-check');
    const tierCards = document.querySelectorAll('.tier-card');
    const calculateBtn = document.getElementById('calculate-cost-btn');
    const estimateModal = document.getElementById('quote-modal');
    const closeModalBtn = document.getElementById('close-quote-modal-btn');
    const customerForm = document.getElementById('estimator-customer-form');

    // Pricing Matrix (Approx base costs based on market benchmarks)
    const baseRates = {
        '1bhk': { base: 2800, name: '1 BHK (Smart Compact)', sqft: '450 - 650 sq ft' },
        '2bhk': { base: 4500, name: '2 BHK (Modern Living)', sqft: '700 - 1050 sq ft' },
        '3bhk': { base: 6800, name: '3 BHK (Spacious Family)', sqft: '1100 - 1550 sq ft' },
        '4bhk': { base: 9800, name: '4 BHK / Villa (Luxury)', sqft: '1800+ sq ft' }
    };

    const tierMultipliers = {
        'essential': { mult: 1.0, name: 'Essential (Quality Laminates, 5-Yr Warranty)' },
        'premium': { mult: 1.35, name: 'DesignCafe Premium (SpaceCraft™ + 20% Space, 10-Yr Warranty)' },
        'luxe': { mult: 1.75, name: 'Luxe Bespoke (Anti-scratch Acrylic/PU, Voice Smart Tech)' }
    };

    let selectedFlat = '2bhk';
    let selectedTier = 'premium';

    flatPills.forEach(pill => {
        pill.addEventListener('click', () => {
            flatPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            selectedFlat = pill.getAttribute('data-flat');
            updateSummaryPreview();
        });
    });

    tierCards.forEach(card => {
        card.addEventListener('click', () => {
            tierCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selectedTier = card.getAttribute('data-tier');
            updateSummaryPreview();
        });
    });

    roomCheckboxes.forEach(chk => {
        chk.addEventListener('change', updateSummaryPreview);
    });

    function getSelectedRooms() {
        const rooms = [];
        roomCheckboxes.forEach(chk => {
            if (chk.checked) rooms.push(chk.value);
        });
        return rooms;
    }

    function calculateTotal() {
        const flatData = baseRates[selectedFlat] || baseRates['2bhk'];
        const tierData = tierMultipliers[selectedTier] || tierMultipliers['premium'];
        const selectedRooms = getSelectedRooms();

        // Calculate room factor (ratio of checked rooms)
        const totalRoomsAvailable = roomCheckboxes.length || 5;
        const roomRatio = Math.max(0.4, selectedRooms.length / totalRoomsAvailable);

        const calculated = Math.round(flatData.base * tierData.mult * roomRatio);
        const minRange = Math.round(calculated * 0.92);
        const maxRange = Math.round(calculated * 1.12);

        return {
            min: minRange,
            max: maxRange,
            avg: calculated,
            flat: flatData,
            tier: tierData,
            rooms: selectedRooms
        };
    }

    function updateSummaryPreview() {
        const previewEl = document.getElementById('estimator-live-preview');
        if (!previewEl) return;

        const res = calculateTotal();
        previewEl.innerHTML = `
            <div class="est-preview-card">
                <span class="est-badge"><i class="fa-solid fa-calculator"></i> Live Estimate Range</span>
                <h3 class="est-cost-headline">$${res.min.toLocaleString()} - $${res.max.toLocaleString()}</h3>
                <p class="est-details-note">Based on ${res.flat.name} • ${res.tier.name.split('(')[0]} • ${res.rooms.length} Spaces Selected</p>
                <div class="space-saved-pill">
                    <i class="fa-solid fa-wand-magic-sparkles text-warning"></i>
                    <span><strong>DesignCafe SpaceCraft™</strong> unlocks approx. <strong>240 cu.ft</strong> extra storage!</span>
                </div>
            </div>
        `;
    }

    if (customerForm) {
        customerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('est-name');
            const phoneInput = document.getElementById('est-phone');
            const emailInput = document.getElementById('est-email');
            const cityInput = document.getElementById('est-city');
            const possessionInput = document.getElementById('est-possession');

            if (!nameInput?.value || !phoneInput?.value) {
                showToast('Please provide your name and phone number to generate quote.', 'error');
                return;
            }

            const res = calculateTotal();
            displayQuoteModal({
                name: nameInput.value,
                phone: phoneInput.value,
                email: emailInput?.value || 'N/A',
                city: cityInput?.value || 'Selected City',
                possession: possessionInput?.value || 'Immediate',
                ...res
            });
        });
    }

    function displayQuoteModal(data) {
        if (!estimateModal) return;

        const modalBody = document.getElementById('quote-modal-body');
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="quote-result-header text-center pb-20">
                    <div class="quote-check-icon mb-15">
                        <i class="fa-solid fa-circle-check text-primary fa-3x"></i>
                    </div>
                    <h3 class="text-24 text-bold">Congratulations, ${data.name}!</h3>
                    <p class="text-gray">Your customized interior quotation package is ready.</p>
                </div>

                <div class="quote-price-banner text-center p-20 mb-20 bg-light rounded">
                    <p class="text-uppercase text-12 text-gray mb-5">Estimated Investment Range</p>
                    <h2 class="text-primary text-36 text-bold">$${data.min.toLocaleString()} – $${data.max.toLocaleString()}</h2>
                    <p class="text-14 text-dark mt-5">Flexible EMI Available starting from <strong>$${Math.round(data.avg / 24)}/month</strong></p>
                </div>

                <div class="quote-breakdown-table mb-20">
                    <h4 class="text-16 text-bold mb-10">Quotation Summary</h4>
                    <ul class="quote-list">
                        <li><span>Configuration:</span> <strong>${data.flat.name}</strong></li>
                        <li><span>Square Footage:</span> <strong>${data.flat.sqft}</strong></li>
                        <li><span>Package Tier:</span> <strong>${data.tier.name}</strong></li>
                        <li><span>Selected Rooms:</span> <strong>${data.rooms.join(', ')}</strong></li>
                        <li><span>City & Handover:</span> <strong>${data.city} (${data.possession})</strong></li>
                        <li><span>DesignCafe Warranty:</span> <strong>10 Years Comprehensive</strong></li>
                        <li><span>Delivery Commitment:</span> <strong>45-Day Move-In Guarantee</strong></li>
                    </ul>
                </div>

                <div class="p-15 bg-lightgray rounded mb-20">
                    <p class="text-14">
                        <i class="fa-solid fa-phone-volume text-primary mr-5"></i>
                        Our Senior Design Consultant will reach out to <strong>${data.phone}</strong> to schedule your complimentary 3D VR walkthrough session.
                    </p>
                </div>

                <button class="btn btn-primary btn-block p-12 text-center w-100" id="download-quote-btn">
                    <i class="fa-solid fa-file-pdf mr-10"></i> Download Itemized PDF Estimate
                </button>
            `;

            const downloadBtn = document.getElementById('download-quote-btn');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', () => {
                    showToast('Generating your customized PDF estimate sheet...', 'info');
                    setTimeout(() => {
                        showToast('Quotation downloaded successfully!', 'success');
                    }, 1200);
                });
            }
        }

        estimateModal.classList.add('active');
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            estimateModal.classList.remove('active');
        });
    }

    if (estimateModal) {
        estimateModal.addEventListener('click', (e) => {
            if (e.target === estimateModal) {
                estimateModal.classList.remove('active');
            }
        });
    }

    // Initial calculation preview
    updateSummaryPreview();
}

/* ==========================================================================
   6. SHOWCASE GALLERY FILTERING & LIGHTBOX
   ========================================================================== */
function initGalleryFiltersAndLightbox() {
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('gallery-lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close-btn');

    // Filtering
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => { item.style.opacity = '1'; }, 10);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => { item.style.display = 'none'; }, 200);
                }
            });
        });
    });

    // Lightbox click
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-overlay-title')?.textContent || 'UrbanNest Project Showcase';

        if (img) {
            item.addEventListener('click', () => {
                if (lightboxModal && lightboxImg) {
                    lightboxImg.src = img.src;
                    if (lightboxCaption) lightboxCaption.textContent = caption;
                    lightboxModal.classList.add('active');
                }
            });
        }
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightboxModal.classList.remove('active');
        });
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove('active');
            }
        });
    }
}

/* ==========================================================================
   7. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                faqItems.forEach(i => i.classList.remove('open'));
                if (!isOpen) {
                    item.classList.add('open');
                }
            });
        }
    });
}

/* ==========================================================================
   8. CONTACT FORMS & TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function initContactForms() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Thank you! Your inquiry has been dispatched to our design team.', 'success');
            contactForm.reset();
        });
    }

    const designerConsultBtns = document.querySelectorAll('.book-designer-btn');
    designerConsultBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const designerName = btn.getAttribute('data-designer') || 'our Senior Designer';
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                const msgInput = document.getElementById('contact-message');
                if (msgInput) {
                    msgInput.value = `Hi! I would like to book a 1-on-1 design consultation with ${designerName}.`;
                }
                showToast(`Requesting consultation with ${designerName}`, 'info');
            }
        });
    });
}

function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;

    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-triangle-exclamation';

    toast.innerHTML = `
        <i class="${iconClass} mr-10"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3800);
}
