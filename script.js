document.addEventListener("DOMContentLoaded", function () {


    /* ===============================
       API
    =============================== */

    const API_URL =
        "https://www.themealdb.com/api/json/v1/1";



    /* ===============================
       AOS
    =============================== */

    AOS.init({
        duration: 850,
        once: true,
        offset: 70,
        easing: "ease-out-cubic"
    });



    /* ===============================
       ELEMENT
    =============================== */

    const navbar =
        document.getElementById(
            "mainNavbar"
        );


    const latestRecipes =
        document.getElementById(
            "latestRecipes"
        );


    const popularRecipes =
        document.getElementById(
            "popularRecipes"
        );


    const categoryRecipes =
        document.getElementById(
            "categoryRecipes"
        );


    const latestLoading =
        document.getElementById(
            "latestLoading"
        );


    const categoryLoading =
        document.getElementById(
            "categoryLoading"
        );


    const recipeSearch =
        document.getElementById(
            "recipeSearch"
        );


    const searchButton =
        document.getElementById(
            "searchButton"
        );


    const heroSearch =
        document.getElementById(
            "heroSearch"
        );


    const heroSearchButton =
        document.getElementById(
            "heroSearchButton"
        );


    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    const notFound =
        document.getElementById(
            "notFound"
        );


    const apiStatus =
        document.getElementById(
            "apiStatus"
        );


    const refreshLatest =
        document.getElementById(
            "refreshLatest"
        );


    const backToTop =
        document.getElementById(
            "backToTop"
        );



    /* ===============================
       NAVBAR SCROLL
    =============================== */

    function updateNavbar() {

        if (window.scrollY > 50) {

            navbar.classList.add(
                "navbar-scroll"
            );

        } else {

            navbar.classList.remove(
                "navbar-scroll"
            );

        }

    }


    updateNavbar();


    window.addEventListener(
        "scroll",
        updateNavbar
    );



    /* ===============================
       SCROLLSPY BOOTSTRAP
    =============================== */

    const bootstrapScrollSpy =
        bootstrap.ScrollSpy.getOrCreateInstance(
            document.body,
            {
                target: "#mainNavbar",
                offset: 120
            }
        );


    function refreshScrollSpy() {

        if (bootstrapScrollSpy) {

            bootstrapScrollSpy.refresh();

        }

    }



    /* ===============================
       SCROLLSPY MANUAL
       supaya lebih stabil
    =============================== */

    const sections =
        document.querySelectorAll(
            "header[id], section[id]"
        );


    const navLinks =
        document.querySelectorAll(
            "#mainNavbar .nav-link"
        );


    function updateActiveNavbar() {

        const scrollPosition =
            window.scrollY + 170;


        let currentSection =
            "home";


        sections.forEach(
            function (section) {

                const sectionTop =
                    section.offsetTop;


                const sectionHeight =
                    section.offsetHeight;


                if (
                    scrollPosition >=
                    sectionTop &&

                    scrollPosition <
                    sectionTop +
                    sectionHeight
                ) {

                    currentSection =
                        section.getAttribute(
                            "id"
                        );

                }

            }
        );


        /* jika sudah hampir footer */

        if (
            window.innerHeight +
            window.scrollY >=

            document.documentElement
                .scrollHeight - 10
        ) {

            currentSection =
                "kontak";

        }


        navLinks.forEach(
            function (link) {

                link.classList.remove(
                    "active"
                );


                const href =
                    link.getAttribute(
                        "href"
                    );


                if (
                    href ===
                    "#" +
                    currentSection
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            }
        );

    }



    window.addEventListener(
        "scroll",
        updateActiveNavbar
    );


    window.addEventListener(
        "resize",
        function () {

            refreshScrollSpy();

            updateActiveNavbar();

        }
    );


    updateActiveNavbar();



    /* ===============================
       SMOOTH NAVBAR
    =============================== */

    navLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const targetId =
                        this.getAttribute(
                            "href"
                        );


                    if (
                        !targetId ||
                        !targetId.startsWith("#")
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {

                        return;

                    }


                    event.preventDefault();


                    const navbarHeight =
                        navbar.offsetHeight;


                    const targetPosition =
                        target.offsetTop -
                        navbarHeight -
                        10;


                    window.scrollTo({
                        top:
                            targetPosition,

                        behavior:
                            "smooth"
                    });


                    const navbarMenu =
                        document.getElementById(
                            "navbarMenu"
                        );


                    if (
                        navbarMenu.classList
                            .contains("show")
                    ) {

                        const collapse =
                            bootstrap.Collapse
                                .getOrCreateInstance(
                                    navbarMenu
                                );


                        collapse.hide();

                    }

                }
            );

        }
    );



    /* ===============================
       CREATE CARD
    =============================== */

    function createRecipeCard(
        meal
    ) {

        return `

            <div
                class="col-lg-4 col-md-6"
                data-aos="fade-up"
            >

                <div class="recipe-card">

                    <div class="recipe-image">

                        <img
                            src="${meal.strMealThumb}"
                            alt="${meal.strMeal}"
                        >

                        <span class="recipe-badge">

                            ${
                                meal.strCategory ||
                                "Recipe"
                            }

                        </span>

                    </div>


                    <div class="recipe-content">

                        <h4>
                            ${meal.strMeal}
                        </h4>


                        <p>

                            ${
                                meal.strArea
                                    ?
                                    "Masakan " +
                                    meal.strArea

                                    :

                                    "Inspirasi resep pilihan"
                            }

                        </p>


                        <button
                            class="detail-btn"
                            onclick="showRecipeDetail('${meal.idMeal}')"
                        >

                            Lihat Resep

                            <i class="bi bi-arrow-right"></i>

                        </button>

                    </div>

                </div>

            </div>

        `;

    }



    /* ===============================
       RANDOM RECIPE
    =============================== */

    async function getRandomRecipe() {

        const response =
            await fetch(
                `${API_URL}/random.php`
            );


        if (!response.ok) {

            throw new Error(
                "Gagal mengambil resep."
            );

        }


        const data =
            await response.json();


        return data.meals[0];

    }



    /* ===============================
       RESEP TERBARU
    =============================== */

    async function loadLatestRecipes() {

        latestRecipes.innerHTML =
            "";


        latestLoading.style.display =
            "block";


        latestLoading.innerHTML = `

            <div
                class="spinner-border"
            ></div>

            <p>
                Mengambil resep...
            </p>

        `;


        try {

            const recipes = [];


            let attempts = 0;


            while (
                recipes.length < 6 &&
                attempts < 20
            ) {

                attempts++;


                const meal =
                    await getRandomRecipe();


                const alreadyExists =
                    recipes.some(
                        function (item) {

                            return (
                                item.idMeal ===
                                meal.idMeal
                            );

                        }
                    );


                if (!alreadyExists) {

                    recipes.push(
                        meal
                    );

                }

            }


            latestRecipes.innerHTML =
                recipes
                    .map(
                        createRecipeCard
                    )
                    .join("");


            latestLoading.style.display =
                "none";


            AOS.refresh();


            refreshScrollSpy();


            updateActiveNavbar();

        } catch (error) {

            latestLoading.innerHTML = `

                <p>
                    Gagal mengambil
                    data API.
                </p>

            `;


            console.error(
                error
            );

        }

    }



    /* ===============================
       RESEP POPULER
    =============================== */

    async function loadPopularRecipes() {

        popularRecipes.innerHTML =
            "";


        try {

            const response =
                await fetch(
                    `${API_URL}/filter.php?c=Dessert`
                );


            if (!response.ok) {

                throw new Error(
                    "Gagal mengambil resep populer."
                );

            }


            const data =
                await response.json();


            const meals =
                data.meals
                    .slice(
                        0,
                        3
                    );


            const details =
                await Promise.all(

                    meals.map(
                        async function (
                            meal
                        ) {

                            const detailResponse =
                                await fetch(
                                    `${API_URL}/lookup.php?i=${meal.idMeal}`
                                );


                            const detailData =
                                await detailResponse
                                    .json();


                            return (
                                detailData
                                    .meals[0]
                            );

                        }
                    )

                );


            popularRecipes.innerHTML =
                details
                    .map(
                        createRecipeCard
                    )
                    .join("");


            AOS.refresh();


            refreshScrollSpy();


            updateActiveNavbar();

        } catch (error) {

            popularRecipes.innerHTML = `

                <div
                    class="col-12 text-center"
                >

                    <p>
                        Gagal mengambil
                        resep populer.
                    </p>

                </div>

            `;


            console.error(
                error
            );

        }

    }



    /* ===============================
       TRANSLATE CATEGORY
    =============================== */

    function translateCategory(
        category
    ) {

        const categories = {

            Chicken:
                "Ayam",

            Seafood:
                "Ikan",

            Vegetarian:
                "Sayur",

            Dessert:
                "Dessert"

        };


        return (
            categories[category] ||
            category
        );

    }



    /* ===============================
       CATEGORY
    =============================== */

    async function loadCategory(
        category
    ) {

        categoryRecipes.innerHTML =
            "";


        categoryLoading.style.display =
            "block";


        categoryLoading.innerHTML = `

            <div
                class="spinner-border"
            ></div>

            <p>
                Mengambil data
                dari API...
            </p>

        `;


        notFound.classList.add(
            "d-none"
        );


        apiStatus.textContent =
            "Mengambil kategori " +
            translateCategory(
                category
            ) +
            "...";


        try {

            const response =
                await fetch(
                    `${API_URL}/filter.php?c=${encodeURIComponent(category)}`
                );


            if (!response.ok) {

                throw new Error(
                    "Kategori gagal dimuat."
                );

            }


            const data =
                await response.json();


            categoryLoading.style.display =
                "none";


            if (
                !data.meals ||
                data.meals.length === 0
            ) {

                notFound.classList.remove(
                    "d-none"
                );


                apiStatus.textContent =
                    "Resep tidak ditemukan.";


                refreshScrollSpy();


                return;

            }


            const meals =
                data.meals.slice(
                    0,
                    12
                );


            categoryRecipes.innerHTML =
                meals
                    .map(
                        function (
                            meal
                        ) {

                            return `

                                <div
                                    class="col-lg-4 col-md-6"
                                    data-aos="fade-up"
                                >

                                    <div class="recipe-card">

                                        <div class="recipe-image">

                                            <img
                                                src="${meal.strMealThumb}"
                                                alt="${meal.strMeal}"
                                            >

                                            <span
                                                class="recipe-badge"
                                            >

                                                ${
                                                    translateCategory(
                                                        category
                                                    )
                                                }

                                            </span>

                                        </div>


                                        <div class="recipe-content">

                                            <h4>

                                                ${meal.strMeal}

                                            </h4>


                                            <p>

                                                Klik tombol
                                                di bawah
                                                untuk melihat
                                                bahan dan
                                                cara memasak.

                                            </p>


                                            <button
                                                class="detail-btn"
                                                onclick="showRecipeDetail('${meal.idMeal}')"
                                            >

                                                Lihat Resep

                                                <i
                                                    class="bi bi-arrow-right"
                                                ></i>

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            `;

                        }
                    )
                    .join("");


            apiStatus.textContent =
                "Menampilkan kategori " +
                translateCategory(
                    category
                );


            AOS.refresh();


            refreshScrollSpy();


            updateActiveNavbar();

        } catch (error) {

            categoryLoading.style.display =
                "none";


            categoryRecipes.innerHTML = `

                <div
                    class="col-12 text-center"
                >

                    <p>
                        Tidak dapat
                        mengambil data
                        dari API.
                    </p>

                </div>

            `;


            console.error(
                error
            );

        }

    }



    /* ===============================
       FILTER CATEGORY
    =============================== */

    filterButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    filterButtons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    this.classList.add(
                        "active"
                    );


                    const category =
                        this.dataset.category;


                    recipeSearch.value =
                        "";


                    loadCategory(
                        category
                    );

                }
            );

        }
    );



    /* ===============================
       SEARCH
    =============================== */

    async function searchRecipe(
        keyword
    ) {

        keyword =
            keyword.trim();


        if (
            keyword === ""
        ) {

            loadCategory(
                "Chicken"
            );

            return;

        }


        categoryRecipes.innerHTML =
            "";


        categoryLoading.style.display =
            "block";


        categoryLoading.innerHTML = `

            <div
                class="spinner-border"
            ></div>

            <p>
                Mencari resep...
            </p>

        `;


        notFound.classList.add(
            "d-none"
        );


        apiStatus.textContent =
            `Mencari "${keyword}"...`;


        try {

            const response =
                await fetch(
                    `${API_URL}/search.php?s=${encodeURIComponent(keyword)}`
                );


            if (!response.ok) {

                throw new Error(
                    "Pencarian gagal."
                );

            }


            const data =
                await response.json();


            categoryLoading.style.display =
                "none";


            if (
                !data.meals
            ) {

                notFound.classList.remove(
                    "d-none"
                );


                apiStatus.textContent =
                    `Tidak ditemukan resep "${keyword}"`;


                refreshScrollSpy();


                updateActiveNavbar();


                return;

            }


            categoryRecipes.innerHTML =
                data.meals
                    .map(
                        createRecipeCard
                    )
                    .join("");


            apiStatus.textContent =
                `${data.meals.length} resep ditemukan untuk "${keyword}"`;


            filterButtons.forEach(
                function (btn) {

                    btn.classList.remove(
                        "active"
                    );

                }
            );


            AOS.refresh();


            refreshScrollSpy();


            updateActiveNavbar();

        } catch (error) {

            categoryLoading.style.display =
                "none";


            apiStatus.textContent =
                "Terjadi kesalahan saat mengakses API.";


            console.error(
                error
            );

        }

    }



    /* ===============================
       SEARCH BUTTON
    =============================== */

    searchButton.addEventListener(
        "click",
        function () {

            searchRecipe(
                recipeSearch.value
            );

        }
    );



    recipeSearch.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                searchRecipe(
                    recipeSearch.value
                );

            }

        }
    );



    /* ===============================
       HERO SEARCH
    =============================== */

    function searchFromHero() {

        const keyword =
            heroSearch.value
                .trim();


        if (
            keyword === ""
        ) {

            return;

        }


        recipeSearch.value =
            keyword;


        const categorySection =
            document.getElementById(
                "kategori"
            );


        const navbarHeight =
            navbar.offsetHeight;


        window.scrollTo({

            top:
                categorySection.offsetTop -
                navbarHeight -
                10,

            behavior:
                "smooth"

        });


        searchRecipe(
            keyword
        );

    }



    heroSearchButton.addEventListener(
        "click",
        searchFromHero
    );



    heroSearch.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                searchFromHero();

            }

        }
    );



    /* ===============================
       DETAIL RECIPE
    =============================== */

    window.showRecipeDetail =
        async function (id) {


            const modalTitle =
                document.getElementById(
                    "modalRecipeTitle"
                );


            const modalContent =
                document.getElementById(
                    "modalRecipeContent"
                );


            modalTitle.textContent =
                "Mengambil resep...";


            modalContent.innerHTML = `

                <div class="loading-box">

                    <div
                        class="spinner-border"
                    ></div>

                    <p>
                        Mengambil detail
                        resep...
                    </p>

                </div>

            `;


            const modalElement =
                document.getElementById(
                    "recipeModal"
                );


            const modal =
                bootstrap.Modal
                    .getOrCreateInstance(
                        modalElement
                    );


            modal.show();


            try {

                const response =
                    await fetch(
                        `${API_URL}/lookup.php?i=${id}`
                    );


                if (!response.ok) {

                    throw new Error(
                        "Detail gagal."
                    );

                }


                const data =
                    await response.json();


                const meal =
                    data.meals[0];


                modalTitle.textContent =
                    meal.strMeal;


                let ingredients =
                    "";


                for (
                    let i = 1;
                    i <= 20;
                    i++
                ) {

                    const ingredient =
                        meal[
                            `strIngredient${i}`
                        ];


                    const measure =
                        meal[
                            `strMeasure${i}`
                        ];


                    if (
                        ingredient &&
                        ingredient
                            .trim() !== ""
                    ) {

                        ingredients += `

                            <li>

                                ${
                                    measure ||
                                    ""
                                }

                                ${ingredient}

                            </li>

                        `;

                    }

                }


                modalContent.innerHTML = `

                    <img
                        src="${meal.strMealThumb}"
                        class="detail-image"
                        alt="${meal.strMeal}"
                    >


                    <div
                        class="recipe-detail-info"
                    >

                        <span>

                            <i
                                class="bi bi-tag"
                            ></i>

                            ${
                                meal.strCategory ||
                                "-"
                            }

                        </span>


                        <span>

                            <i
                                class="bi bi-geo-alt"
                            ></i>

                            ${
                                meal.strArea ||
                                "-"
                            }

                        </span>

                    </div>


                    <h5>
                        Bahan-bahan
                    </h5>


                    <ul
                        class="ingredients-list"
                    >

                        ${ingredients}

                    </ul>


                    <hr>


                    <h5>
                        Cara Membuat
                    </h5>


                    <p
                        class="instructions"
                    >

                        ${
                            meal.strInstructions ||
                            "Cara memasak tidak tersedia."
                        }

                    </p>

                `;

            } catch (error) {

                modalTitle.textContent =
                    "Terjadi Kesalahan";


                modalContent.innerHTML = `

                    <p>
                        Detail resep gagal
                        diambil dari API.
                    </p>

                `;


                console.error(
                    error
                );

            }

        };



    /* ===============================
       REFRESH RECIPE
    =============================== */

    refreshLatest.addEventListener(
        "click",
        function () {

            loadLatestRecipes();

        }
    );



    /* ===============================
       CONTACT FORM
    =============================== */

    const contactForm =
        document.getElementById(
            "contactForm"
        );


    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            alert(
                "Pesan berhasil dikirim!"
            );


            this.reset();

        }
    );



    /* ===============================
       BACK TO TOP
    =============================== */

    function updateBackToTop() {

        if (
            window.scrollY >
            500
        ) {

            backToTop.classList.add(
                "show"
            );

        } else {

            backToTop.classList.remove(
                "show"
            );

        }

    }


    updateBackToTop();


    window.addEventListener(
        "scroll",
        updateBackToTop
    );


    backToTop.addEventListener(
        "click",
        function () {

            window.scrollTo({

                top: 0,

                behavior:
                    "smooth"

            });

        }
    );



    /* ===============================
       REFRESH SETELAH SEMUA LOAD
    =============================== */

    window.addEventListener(
        "load",
        function () {

            refreshScrollSpy();

            updateActiveNavbar();

            AOS.refresh();

        }
    );



    /* ===============================
       LOAD PERTAMA
    =============================== */

    loadLatestRecipes();

    loadPopularRecipes();

    loadCategory(
        "Chicken"
    );

});