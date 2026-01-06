/* ========================================
   PORTFOLIO PENTESTER - JAVASCRIPT
   Particules connectées + Easter egg terminal
   ======================================== */

// ========================================
// ANIMATION PARTICULES CONNECTÉES (RÉSEAU)
// ========================================
class NetworkParticles {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };

        // Couleurs personnalisables via data-attributes
        const primary = this.canvas.dataset.colorPrimary || '#06b6d4';
        const secondary = this.canvas.dataset.colorSecondary || '#a855f7';

        this.colors = {
            particle: primary,
            particleAlt: secondary,
            primaryRgb: this.hexToRgb(primary),
            secondaryRgb: this.hexToRgb(secondary)
        };

        this.maxParticles = 80;
        this.connectionDistance = 120;

        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 6, g: 182, b: 212 };
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        const particleCount = Math.min(this.maxParticles, Math.floor((this.canvas.width * this.canvas.height) / 15000));

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                color: Math.random() > 0.7 ? this.colors.particleAlt : this.colors.particle
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    const opacity = 1 - (distance / this.connectionDistance);
                    const rgb = this.colors.primaryRgb;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.2})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    drawMouseConnections() {
        if (!this.mouse.x || !this.mouse.y) return;

        for (let particle of this.particles) {
            const dx = particle.x - this.mouse.x;
            const dy = particle.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouse.radius) {
                const opacity = 1 - (distance / this.mouse.radius);
                const rgb = this.colors.secondaryRgb;
                this.ctx.beginPath();
                this.ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.5})`;
                this.ctx.lineWidth = 1.5;
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.stroke();
            }
        }
    }

    updateParticles() {
        for (let particle of this.particles) {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Rebond sur les bords
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // Attraction légère vers la souris
            if (this.mouse.x && this.mouse.y) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius * 0.01;
                    particle.vx += dx * force * 0.1;
                    particle.vy += dy * force * 0.1;
                }
            }

            // Limite de vitesse
            const maxSpeed = 1;
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (speed > maxSpeed) {
                particle.vx = (particle.vx / speed) * maxSpeed;
                particle.vy = (particle.vy / speed) * maxSpeed;
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawConnections();
        this.drawMouseConnections();

        for (let particle of this.particles) {
            this.drawParticle(particle);
        }
    }

    animate() {
        this.updateParticles();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// EASTER EGG - TERMINAL CACHÉ
// ========================================
class HiddenTerminal {
    constructor() {
        this.isOpen = false;
        this.commands = {
            'help': 'Commandes disponibles: help, whoami, skills, contact, clear, exit',
            'whoami': 'Matthieu - Pentester en reconversion\n> Passionné de cybersécurité\n> CTF Player\n> En quête de nouveaux défis',
            'skills': '> Pentest & Red Team\n> Python, Bash\n> Web Security (OWASP)\n> Network Analysis\n> Linux Administration',
            'contact': '> Email: votre@email.com\n> LinkedIn: /in/votre-profil\n> GitHub: github.com/votre-pseudo',
            'clear': 'CLEAR',
            'exit': 'EXIT',
            'sudo': 'Nice try! But no root access here ;)',
            'ls': 'skills.txt  projects/  cv.pdf  secrets.enc',
            'cat secrets.enc': 'Access Denied - Try harder!',
            'hack': 'Hacking in progress... Just kidding. Stay ethical!',
        };
        this.history = [];
        this.historyIndex = -1;
        this.createTerminal();
        this.bindKeys();
    }

    createTerminal() {
        // Container du terminal
        this.terminal = document.createElement('div');
        this.terminal.id = 'hidden-terminal';
        this.terminal.innerHTML = `
            <div class="terminal-header">
                <span class="terminal-title">~/matthieu/portfolio $</span>
                <span class="terminal-close">&times;</span>
            </div>
            <div class="terminal-body">
                <div class="terminal-output">
                    <p class="terminal-welcome">Welcome to Matthieu's terminal!</p>
                    <p class="terminal-hint">Type 'help' for available commands</p>
                </div>
                <div class="terminal-input-line">
                    <span class="terminal-prompt">$</span>
                    <input type="text" class="terminal-input" autofocus spellcheck="false">
                </div>
            </div>
        `;
        document.body.appendChild(this.terminal);

        // Références
        this.output = this.terminal.querySelector('.terminal-output');
        this.input = this.terminal.querySelector('.terminal-input');
        this.closeBtn = this.terminal.querySelector('.terminal-close');

        // Events
        this.closeBtn.addEventListener('click', () => this.close());
        this.input.addEventListener('keydown', (e) => this.handleInput(e));
    }

    bindKeys() {
        document.addEventListener('keydown', (e) => {
            // Ctrl + Shift + T pour ouvrir
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggle();
            }
            // Escape pour fermer
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.terminal.classList.add('active');
        setTimeout(() => this.input.focus(), 100);
    }

    close() {
        this.isOpen = false;
        this.terminal.classList.remove('active');
    }

    handleInput(e) {
        if (e.key === 'Enter') {
            const cmd = this.input.value.trim().toLowerCase();
            if (cmd) {
                this.history.push(cmd);
                this.historyIndex = this.history.length;
                this.executeCommand(cmd);
            }
            this.input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.history[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                this.input.value = this.history[this.historyIndex];
            } else {
                this.historyIndex = this.history.length;
                this.input.value = '';
            }
        }
    }

    executeCommand(cmd) {
        // Afficher la commande
        this.addOutput(`$ ${cmd}`, 'command');

        // Traiter la commande
        const response = this.commands[cmd];

        if (response === 'CLEAR') {
            this.output.innerHTML = '';
            return;
        }

        if (response === 'EXIT') {
            this.close();
            return;
        }

        if (response) {
            this.addOutput(response, 'response');
        } else {
            this.addOutput(`Command not found: ${cmd}. Type 'help' for available commands.`, 'error');
        }

        // Scroll vers le bas
        this.output.scrollTop = this.output.scrollHeight;
    }

    addOutput(text, type = 'response') {
        const p = document.createElement('p');
        p.className = `terminal-${type}`;
        p.innerHTML = text.replace(/\n/g, '<br>');
        this.output.appendChild(p);
    }
}

// ========================================
// NAVIGATION MOBILE
// ========================================
function initMobileNav() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Fermer le menu quand on clique sur un lien
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
}

// ========================================
// ANIMATION AU SCROLL
// ========================================
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// ========================================
// ANIMATION DES BARRES DE COMPÉTENCES
// ========================================
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.dataset.progress || 0;
                entry.target.style.width = `${progress}%`;
            }
        });
    }, {
        threshold: 0.5
    });

    skillBars.forEach(bar => observer.observe(bar));
}

// ========================================
// NAVIGATION ACTIVE
// ========================================
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ========================================
// EFFET DE TYPING
// ========================================
class TypeWriter {
    constructor(element, words, wait = 3000) {
        this.element = element;
        this.words = words;
        this.wait = parseInt(wait, 10);
        this.wordIndex = 0;
        this.txt = '';
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.element.innerHTML = `<span class="typing">${this.txt}</span>`;

        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ========================================
// SMOOTH SCROLL POUR LES ANCRES
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// FORMULAIRE DE CONTACT
// ========================================
function initContactForm() {
    // Désactivé pour laisser Formspree gérer le formulaire
    return;
}

// ========================================
// HEADER SCROLL EFFECT
// ========================================
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
}

// ========================================
// INITIALISATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Animation particules (sur toutes les pages avec le canvas)
    if (document.getElementById('particles-canvas')) {
        new NetworkParticles('particles-canvas');
    }

    // Easter egg terminal (disponible sur toutes les pages)
    new HiddenTerminal();

    // Initialisation des autres fonctionnalités
    initMobileNav();
    initScrollAnimations();
    initSkillBars();
    setActiveNav();
    initSmoothScroll();
    initContactForm();
    initHeaderScroll();

    // Effet de typing si l'élément existe
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const words = JSON.parse(typingElement.dataset.words || '["Pentester", "Security Researcher", "CTF Player"]');
        new TypeWriter(typingElement, words);
    }

    // Petit indice discret pour l'easter egg (affiché dans la console)
    console.log('%c🔐 Psst... Try Ctrl+Shift+T', 'color: #a855f7; font-size: 14px;');
});

// ========================================
// UTILITAIRES
// ========================================

// Debounce pour optimiser les events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle pour limiter les appels
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
