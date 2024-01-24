'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////// btn scrolling
btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

/////////////// page navigation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////// tab component

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  ///////////////////////console.log(clicked);

  //guard clause
  if (!clicked) return;

  //remove active class
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //active tab
  clicked.classList.add('operations__tab--active');

  //activate content area
  ////////////////////////console.log(clicked.dataset.tab);
  const dataSet = document.querySelector(
    `.operations__content--${clicked.dataset.tab}`
  );
  dataSet.classList.add('operations__content--active');
});

/////////menu fade animation
const nav = document.querySelector('.nav');

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

////////////////////////////////////////////////////////sticky nav

// const initial = section1.getBoundingClientRect();
// console.log(initial);

// window.addEventListener('scroll', function () {
//   // console.log(window.scrollY);
//   if (window.scrollY > initial.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

///////////////////////////////////////////////reveal sections
const reveal = document.querySelectorAll('.section');

const secCallback = function (entries, obs) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  obs.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(secCallback, {
  root: null,
  threshold: 0.15,
});

reveal.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////////////////////lazy loading imgs

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, obs) {
  const [entry] = entries;
  //console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  obs.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.1,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

////////////////////////////////////////////slider

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let currentSlide = 0;
  const maxSlide = slides.length;

  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.5)';
  // slider.style.overflow = 'visible';

  /////////functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  // createDots();

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };
  // activateDot(0);

  // slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
      // -100 0 100 200
    );
  };
  // goToSlide(0);

  //next slide
  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) currentSlide = 0;
    else currentSlide++;

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const prevSlide = function () {
    if (currentSlide === 0) currentSlide = maxSlide - 1;
    else currentSlide--;

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  ///event handler
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide(); //using if condition
    e.key === 'ArrowRight' && nextSlide(); //using short-circuiting method
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      //const slide = e.target.dataset.slide; //OR
      const { slide } = e.target.dataset;
      goToSlide(slide);

      activateDot(slide);
    }
  });
};
slider();
////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////
const obsCallback = function (ent, obse) {
  ent.forEach(() => {
    // console.log(ent);
  });
};

const obs = {
  root: null,
  threshold: 0.6,
};

const observer = new IntersectionObserver(obsCallback, obs);
//observer.observe(section1);
