import app from './app';

const { PORT } = process.env;

app.listen(PORT, () => {
	console.log(`Running on port ${PORT}!`);
});
