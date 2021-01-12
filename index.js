const autoCompleteConfig = {
    renderOption: (movie) => {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${imgSrc}"/>
            ${movie.Title} (${movie.Year})
       `;
    },
    inputValue: (movie) => {
        return movie.Title;
    },
    fetchData: async (searchTerm) => {
        const searchResponse = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: 'b14b5ae4',
                s: searchTerm,
                type: 'movie'
            }
        });
        if (searchResponse.data.Error) {
            return [];
        }
        return searchResponse.data.Search;
    }
}
createAutocomplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect: (movie) => {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(
            movie,
            document.querySelector('#left-summary'),
            'left'
        );
    }
});
createAutocomplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect: (movie) => {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(
            movie,
            document.querySelector('#right-summary'),
            'right'
        );
    }
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'b14b5ae4',
            i: movie.imdbID
        }
    });

    summaryElement.innerHTML = movieTemplate(response.data);

    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];
        const leftSideValue = parseFloat(leftStat.dataset.value);
        const rightSideValue = parseFloat(rightStat.dataset.value);

        leftStat.classList.remove('has-background-primary-light');
        leftStat.classList.add('is-primary');
        rightStat.classList.remove('has-background-primary-light');
        rightStat.classList.add('is-primary');

        if (isNaN(leftSideValue) || isNaN(rightSideValue)) {
            return;
        }
        if (rightSideValue === leftSideValue) {
            return;
        }
        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('has-background-primary-light');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('has-background-primary-light');
        }
    });
}

const movieTemplate = (movieDetail) => {
    const dollars = movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '');
    const metascore = movieDetail.Metascore;
    const imdbRating = movieDetail.imdbRating;
    const imdbVotes = movieDetail.imdbVotes.replace(/,/g, '');
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);

        if (isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0);

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}"></img>
                </p>
            </figure>
        <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">imdb Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">imdb Votes</p>
        </article>
    `;
};
