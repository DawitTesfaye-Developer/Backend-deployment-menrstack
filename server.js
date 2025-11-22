app.use(helmet());
app.use(cors());
if(process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
}
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});
