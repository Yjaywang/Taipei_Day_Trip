import view from "../view/index_view.js";
let model = {
  keyword: null,
  nextPage: null,
  loading: true,
  currentPage: 0,
  attractionData: null,
  categoryData: null,
  init: async function () {
    //main page init
    this.loading = true;
    this.attractionData = null;
    const url = "api/attractions?page=0";
    try {
      const response = await fetch(url);
      const data = await response.json();
      this.attractionData = data.data;
      this.nextPage = data.nextPage;

      document.querySelector("footer").style.display = "flex";
    } catch (error) {
      console.log(error);
    }
  },
  category: async function () {
    const url = "api/categories";
    this.category = {};
    try {
      const response = await fetch(url);
      const data = await response.json();
      this.categoryData = data;
    } catch (error) {
      console.log(error);
    }
  },
  search: async function () {
    this.loading = true;
    this.attractionData = null;
    const attractionsEl = document.querySelector(".attractions");
    let url = "api/attractions";
    if (!this.keyword) {
      url = url + "?page=0";
    } else {
      url = url + `?page=0&keyword=${this.keyword}`;
    }
    attractionsEl.textContent = ""; //remove all elements inside attractions-container
    try {
      const response = await fetch(url);
      const data = await response.json();
      this.nextPage = data.nextPage;
      this.attractionData = data.data;
    } catch (error) {
      console.log(error);
    }
  },

  scrollLoadMore: function (entries) {
    entries.forEach(async function (entry) {
      if (entry.isIntersecting) {
        //entry.isIntersecting=> true, see the element
        if (
          !model.nextPage ||
          model.loading ||
          model.currentPage === model.nextPage
        ) {
          return;
        }

        model.currentPage = model.nextPage; //if can fetch data, set current page as next page
        let url = "api/attractions";
        if (!model.keyword) {
          url = url + `?page=${String(model.nextPage)}`;
        } else {
          url =
            url + `?page=${String(model.nextPage)}&keyword=${model.keyword}`;
        }
        try {
          const response = await fetch(url);
          const data = await response.json();
          model.nextPage = data.nextPage;
          view.render(data.data);
        } catch (error) {
          console.log(error);
        }
      }
    });
  },
};

export default model;
