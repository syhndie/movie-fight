const waitFor = (selector) => {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            if (document.querySelector(selector)) {
                clearInterval(interval);
                clearTimeout(timeout);
                resolve();
            }
        }, 30);

        const timeout = setTimeout(() => {
            clearInterval(interval);
            reject();
        }, 5000);
    });
};

//protip: reset environment for each test
//beforeEach is a function globally defined by mocha
beforeEach(() => {
    document.querySelector('#target').innerHTML = '';
    createAutocomplete({
        root: document.querySelector('#target'),
        fetchData() {
            return [
                { Title: 'Squiggles' },
                { Title: 'Squiggles 2: Squigglin Boogaloo' },
                { Title: 'Squiggles in Paradise' }  
            ];
        },
        renderOption(movie) {
            return movie.Title;
        }
    });
});
it('dropdown starts closed', () => {
    const dropdown = document.querySelector('.dropdown');
    //expect is a variable we assigned chai.expect to
    expect(dropdown.className).not.to.include('is-active');
});

it('dropdown appears on input', async () => {
    const input = document.querySelector('input');
    input.value = 'squiggles';
    input.dispatchEvent(new Event('input'));

    //the application has a debounce function applied to the 
    //creation of the dropdown menu, so we need to wait for
    //the dropdown items to exist before we run our test
    await waitFor('.dropdown-item');

    const dropdown = document.querySelector('.dropdown');
    expect(dropdown.className).to.include('is-active');
});