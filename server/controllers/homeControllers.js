const index = (req, res) => {
  res.render('index', {
    title: 'ProjNote',
  });
};

const greeting = (req, res) => {
  res.status(200).json({
    message: 'Hola Campeon de la Fullstack Web',
  });
};

export default {
  index,
  greeting,
};
