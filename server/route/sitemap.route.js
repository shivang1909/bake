import express from 'express';


const router = express.Router();


router.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');


  const sitemap = `<?xml version="1.0" encoding="UTF-8" ?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">


    <url>
      <loc>https://www.bakeflavours.com/</loc>
      <priority>1.0</priority>
    </url>


    <url>
      <loc>https://www.bakeflavours.com/about-us</loc>
      <priority>0.8</priority>
    </url>


    <url>
      <loc>https://www.bakeflavours.com/Contact-Us</loc>
      <priority>0.8</priority>
    </url>


    <url>
      <loc>https://www.bakeflavours.com/shopAll</loc>
      <priority>0.9</priority>
    </url>


    <url>
      <loc>https://www.bakeflavours.com/category/ghee-sweet</loc>
      <priority>0.9</priority>
    </url>


    <!-- You can dynamically add more URLs from your DB later -->


  </urlset>`;


  res.send(sitemap);
});


export default router;
