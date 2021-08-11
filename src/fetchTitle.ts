import axios from "axios";
import * as cheerio from "cheerio";

export async function fetchTitle(url: string): Promise<string> {
  const res = await axios.get<string>(url);
  const $ = cheerio.load(res.data);
  const title = $("title").text().trim();
  return title;
}
