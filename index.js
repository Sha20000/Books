import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { url } from "inspector";
import env from "dotenv";

const app = express();
const port = 3000;
env.config();

const db = new pg.Client({

    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,


});

db.connect();





app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    
    const result = await db.query("SELECT * FROM items ORDER BY id ASC")
    const item = result.rows

    console.log(item)
    


    res.render("index.ejs", {
        listItems: item,
        

    }
    )

});

app.post("/add", async(req, res) => {
   
    res.render("new.ejs");
    
    

});

app.post("/submit", async (req, res) => {

    const title = req.body.title;
    const isbn = req.body.isbn;
    const date = req.body.date;
    const review = req.body.review;
    const description = req.body.description;

    await db.query("INSERT INTO items(title,isbn,date,reviews,description) VALUES($1,$2,$3,$4,$5)", [title, isbn, date, review, description]);

    res.redirect("/")


    
});

app.post("/edit", async (req, res) => {
   
    const id = req.body.updatedItemId;
    console.log(id);

    const title = req.body.updatedItemTitle;
    console.log(title);

    const date = new Date(req.body.updatedItemDate).toISOString(); // Converts to ISO format

    console.log(date);

    const review = req.body.updatedItemReview;
    console.log(review);

    const description = req.body.updatedItemDescription;
    console.log(description);

    await db.query("UPDATE items SET title = ($1), date=($2), reviews=($3), description=($4) WHERE id=($5)", [title, date, review, description, id]);

   


    res.redirect("/");

});

app.post("/delete", async(req, res) => {
   
    const id = req.body.id;
    console.log(id);

    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");




    


});




app.listen(port, () => {
   
    console.log(`Server is running on ${port}`);
    
});




