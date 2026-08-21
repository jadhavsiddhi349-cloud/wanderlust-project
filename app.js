const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const listening = require("./models/listing.js");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const listingSchema = require("./schema.js");

app.use(methodOverride("_method"));
//for views folder
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));//to access content from body and params
//DATABASE SETUP
const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
//ejs mate sertup
app.engine('ejs', ejsMate);
//for css
app.use(express.static(path.join(__dirname, "/public")));

//call to main fuction
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);

});


async function main() {
    await mongoose.connect(MONGO_URL);
    
}

app.get("/",(req,res)=>{
    res.send("working");
});

const validateListing =(req,res,next)=>{
    
     let {error} = listingSchema.validate(req.body);
       console.log(result);
       if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg)
       }else{
        next();
       }

}

//index route

app.get("/testlisting",wrapAsync(async(req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
}));

//new route
app.get("/testlisting/new",(req,res)=>{
    res.render("listings/new.ejs");

});

app.post("/testlisting",validateListing,wrapAsync(async(req,res,next)=>{
    if(!req.body.listing) throw new ExpressError(400,"Invalid Listing Data");
   
        const {title,description,image,price,country,location}=req.body;
     const newListing = new Listing(
 
        {
       
        title,
        description,
          image: typeof image === "string" ? { url: image } : image,
        price,
        country,
        location
    });
     await newListing.save();

    res.redirect("/testlisting");
    
    

}));

//show route
app.get("/testlisting/:id",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});

}));

//edit route
app.get("/testlisting/:id/edit",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

app.put("/testlisting/:id",validateListing,wrapAsync(async(req,res)=>{
   
     const { title, description, image, price, country, location } = req.body;

  await Listing.findByIdAndUpdate(id, {
    title,
    description,
        image: typeof image === "string" ? { url: image } : image,
    price,
    country,
    location
  });

     res.redirect(`/testlisting/${id}`);
    
}));
//delete route
app.delete("/testlisting/:id",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/testlisting");
}));
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err,req,res,next)=>{
    let{statusCode=500 , message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
});


app.listen("8080",()=>{
    console.log("server is listening to port 8080");

});