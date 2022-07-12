const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com',
		'X-RapidAPI-Key': '228f1b1a66msh0712667037f3e0ap14754ajsnb00d5f039219'
	}
};

fetch('https://free-to-play-games-database.p.rapidapi.com/api/game?id=452', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));