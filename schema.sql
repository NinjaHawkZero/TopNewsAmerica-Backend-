CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL
)


CREATE TABLE storys (
    id SERIAL PRIMARY KEY,
    savedBy INTEGER
    REFERENCES users ON DELETE CASCADE,
    author TEXT,
    title TEXT,
    description TEXT,
    publishedAt TEXT,
    url TEXT,
    urlToImage TEXT 

)



