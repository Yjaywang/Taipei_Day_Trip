import controller from "./controller/index_controller.js";

controller.init();


  //IntersectionObserver setting
  {
    const options = {
      root: null,
      rootMargin: '10px',
      threshold: 0.5,
    };
    const observer = new IntersectionObserver(controller.scrollLoadMore, options);
    const targetEl = document.querySelector(".copyright-block");
    observer.observe(targetEl);
  }
  
  