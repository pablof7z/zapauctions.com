import lightningPayReq from 'light-bolt11-decoder';

export function getSinceTime(durationInHours) {
    return Math.floor(Date.now() / 1000) - durationInHours * 60 * 60;
}

export function subscribeMainFilter(pool, durationInHours) {
    let cond = { kinds:[9735] }

    if (durationInHours !== 'all' && durationInHours < 168) {
        cond.since = getSinceTime(durationInHours);
        cond.limit = 100000;
        pool.subscribe([
            cond,
            {kinds: [1], '#t': ['zapraiser']}
        ], false);
    } else {
        pool.subscribe([
            cond,
            {kinds: [1], '#t': ['zapraiser']}
        ], false);
        
        // setTimeout(() => {
            let until = parseInt(new Date().getTime() / 1000);
            for (let i = 90; i >= 0; i--) {
                setTimeout(({until, i}) => {
                    until -= 8 * 60 * 60 * i;
                    const subId = pool.subscribe([ { kinds:[9735], until, limit: 10000 } ], false);
                    console.log(`starting sub with time ${new Date(until*1000).toLocaleDateString()} and ${i} and subId ${subId}`);
                    setTimeout(() => {
                        console.log(`unsubscribing from ${subId}`);
                        pool.unsubscribe(subId);
                    }, i * 15000);
                }, i * 15000, {until, i});
            }
        // }, 5000)
    }
}


export function pubkeyName(pubkey, profiles) {
    if (profiles[pubkey]) {
        return profiles[pubkey].display_name || `@${profiles[pubkey]?.name}`;
    }

    return `«${pubkey.slice(0, 6)}»`;
}

const cheaterList = [
    'dd077ad7d7c6d15851fa95ef0f7e571696704eed17c7a92734635f179e142f8c',
    'a9786646d7f9ff4a9e5d16f7e8f4891eba574e476390c328187448e3b07f3983',
    '738ea36ef74b2ac80bfb3887b40637c7dcdf74ea6eed73c718b7193313b90f9b',
];

export function eventToZap(event) {
    let zap;
    let description = event.tags.find((t) => t[0] === 'description');
    let bolt11 = event.tags.find((t) => t[0] === 'bolt11');
    if (!description || !bolt11 || !bolt11[1]) {
        return null;
    }

    try {
        description = description[1];
        if (description.startsWith("%")) {
            description = decodeURIComponent(description);
        }
        if (description === "") { return null; }

        description = JSON.parse(description);
        bolt11 = lightningPayReq.decode(bolt11[1])
    } catch (e) {
        // console.log(e, {description, event});
        return null;
    }

    const amountSection = bolt11.sections.find((s) => s.name === 'amount')
    if (!amountSection) { return null; }

    const amount = parseInt(amountSection.value) / 1000;
    if (!amount) { return null; }
    
    const sender = description.pubkey;
    const recipient = event.tags.find((t) => t[0] === 'p')[1];

    // ignore self-zaps
    if (sender === recipient) {
        return null;
    }

    const content = description.content || bolt11.description;
    const zapper = event.pubkey;
    const zappedNote = event.tags.find((t) => t[0] === 'e');
    const zappedNoteId = zappedNote ? zappedNote[1] : null;

    zap = {
        id: event.id,
        created_at: event.created_at,
        zappedNoteId,
        zapper,
        sender,
        recipient,
        content,
        event,
        amount,
        bolt11
    }

    if (amount > 20000000) {
        return;
    }

    if (cheaterList.includes(sender)) {
        return null;
    }
    
    return zap;
}