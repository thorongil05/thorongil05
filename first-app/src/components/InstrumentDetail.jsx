class Bond {
  static of(bondName) {
    let bond = new Bond();
    bond.extractType(bondName);
    bond.extractExpirationDate(bondName);
    bond.extractCoupon(bondName);
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
    map.set("AG", 7);
    map.set("ST", 8);
    map.set("OT", 9);
    map.set("NV", 10);

    let month = map.get(dateRegex[2]);
    let year = 2000 + Number(dateRegex[3]);
    let day = dateRegex[1];

    this.bondExpiration = new Date(year, month, day);
  }

  extractCoupon(bondName) {
    let percentageStr = bondName.substring(bondName.indexOf(" "));
    this.bondRate = Number.parseFloat(percentageStr);
  }
}

function InstrumentDetail({ instrument }) {
  let bond = Bond.of(instrument.name);

  let expirationMonthDisplayValue = bond.bondExpiration.toLocaleString(
    "en-US",
    { month: "long" }
  );

  return (
    <div>
      <div>
        Type <span>{bond.bondType}</span>
      </div>
      <div>
        Expiration <span>{expirationMonthDisplayValue}</span>
        <span> - </span>
        <span>{bond.bondExpiration.getFullYear()}</span>
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
