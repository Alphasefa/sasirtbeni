const fs = require("fs");
const path =
  "C:/Users/gnd_s/OneDrive/Masaüstü/sasirtbeni/apps/web/src/app/page.tsx";

let c = fs.readFileSync(path, "utf8");

const lastFooter = c.lastIndexOf("</footer>");
c = c.substring(0, lastFooter + 9);

const ending = `
      </div>
    </div>
  );
}`;

c = c + ending;
fs.writeFileSync(path, c);
console.log("Done");
