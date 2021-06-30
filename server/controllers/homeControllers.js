const index = (req, res) => {
  res.render('home/index', {
    title: 'ProjNote',
  });
};

const greeting = (req, res) => {
  res.status(200).json({
    message: 'Hola Campeon de la Fullstack Web',
  });
};

const about = (req, res) => {
  res.render('home/about', { appVersion: '0.0.1' });
};

export default {
  index,
  greeting,
  about,
};
