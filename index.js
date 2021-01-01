const fetchData = async (searchTerm) => {
    const searchResponse = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'b14b5ae4',
            s: searchTerm,
            type: 'movie'
        }
    });
    return searchResponse.data.Search;
};

const onInput = async (event) => {
    const movies = await fetchData(event.target.value);
    console.log(movies);
};

const input = document.querySelector('input');

input.addEventListener('input', debounce(onInput));
