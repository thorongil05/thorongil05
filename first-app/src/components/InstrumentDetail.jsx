class Bond {
  static of(bondName) {
    const match = bondName.match(/(^[^-]+)-([^\s]+) ((\d*|\d*.\d*)%)/);
    let bond = new Bond();
    bond.extractType(bondName);
    bond.extractExpirationDate(bondName);
    bond.bondRate = match[4];
    return bond;
  }

  extractType(bondName) {
    this.bondType = bondName.substring(0, bondName.indexOf("-"));
  }

  extractExpirationDate(bondName) {
    let dashIndex = bondName.indexOf("-");
    let spaceIndex = bondName.indexOf(" ");
    let dateSubStr = bondName.substring(dashIndex + 1, spaceIndex);

    let dateRegex = dateSubStr.match(/(\d*)(\D*)(\d*)/);
    const map = new Map();
    map.set("ST", 9);

    let month = map.get(dateRegex[2]);
    let year = 2000 + Number(dateRegex[3]);
    let day = dateRegex[1];

    this.bondExpiration = new Date(year, month, day);
  }
}

function InstrumentDetail({ instrument }) {
  let bond = Bond.of(instrument.name);
  console.log(JSON.stringify(bond));
  console.log(bond.bondExpiration.year);

  return (
    <div>
      <div>
        Type <span>{bond.bondType}</span>
      </div>
      <div>
        Expiration <span>{bond.bondExpiration.getFullYear()}</span>
      </div>
      <div>
        Coupon <span>{bond.bondRate} %</span>
      </div>
    </div>
  );
}

import PropTypes from "prop-types";

InstrumentDetail.propTypes = {
  instrument: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default InstrumentDetail;
