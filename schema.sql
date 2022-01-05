CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL
)


CREATE TABLE storys (
    id SERIAL PRIMARY KEY,
    saved_by INTEGER
    REFERENCES users ON DELETE CASCADE,
    author TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    published_at TEXT NOT NULL,
    url TEXT NOT NULL,
    urlToImage TEXT NOT NULL

)



