it('shows an autocomplete', () => {
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

    const dropdown = document.querySelector('.dropdown');
    //expect is a variable we assigned chai.expect to
        expect(dropdown.className).not.to.include('is-active');
});