const express = require("express");
const cors = require("cors");
const ytdlp = require("yt-dlp-exec");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/download", async (req, res) => {
  const url = req.body.url;

  if (!url) {
    return res.json({ success: false, error: "No URL provided" });
  }

  try {
    const output = await ytdlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
    });

    const bestFormat = output.formats?.find((f) => f.ext === "mp4" && f.url);
    const downloadUrl = bestFormat?.url || output.url;

    res.json({ success: true, url: downloadUrl });
  } catch (error) {
    res.json({ success: false, error: "Download failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
