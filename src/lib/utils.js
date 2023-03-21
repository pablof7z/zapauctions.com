export function formatSatoshis(sats, { tryGrouping, justNumber, justUnit } = {}) {
    let groupUnit = '';

    // if (sats >= 1000000) {
    //     if (sats % 100000000 === 0) {
    //         return (sats / 100000000) + " BTC";
    //     }
    //     return (sats / 100000000).toFixed(2) + " BTC";
    // }

    if (tryGrouping && !sats.toString().match(/(420|1337)/)) {
        if (sats >= 1000000) {
            groupUnit = 'M';
            sats = sats / 1000000;
        } else if (sats >= 1000) {
            groupUnit = 'k';
            sats = sats / 1000;
        }
    }

    let v;

    if (groupUnit === 'M' || groupUnit === 'k') {
        // create a string with 2 digits after the decimal point
        v = sats
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

        // if the last two digits are 00, remove them
        if (v.slice(-2) === '00') {
            v = v.slice(0, -3);
        }
    } else if (sats !== 1337) {
        v = sats.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    } else {
        v = sats.toString();
    }

    // if v has more than two spaces, turn the first one into a comma
    if (v.indexOf(' ') > -1) {
        v = v.replace(' ', ',');
    }

    let number = `${v}${groupUnit}`;
    let unit = `sats`;

    if (justNumber) {
        return number;
    }

    if (justUnit) {
        return unit;
    }

    return `${number} ${unit}`;
}

export function massageString(content) {
    const bitcoinImage =
        '<img src="/images/Bitcoin_evergreen.png" style="width: 1.2em; vertical-align: -20%; margin-right: 0.075em; height: 1.2em; margin-left: 2px; display: inline-block;">';

    return content.replace(
        /#bitcoin/i,
        `<span class="whitespace-nowrap">#bitcoin${bitcoinImage}</span>`
    );
}

export function calculateZapriserAmount(event) {
    const match = event.content.match(/#[t]*zapraiser\s+(\d+)([kKmM(btc|BTC)]*)/);
    if (match) {
        const amount = parseInt(match[1]);
        const multiplier = match[2];
        if (multiplier === 'k' || multiplier === 'K') {
            return amount * 1000;
        } else if (multiplier === 'm' || multiplier === 'M') {
            return amount * 1000000;
        } else if (multiplier === 'btc' || multiplier === 'BTC') {
            return amount * 100000000;
        } else {
            return amount;
        }
    }

    return 0;
}
