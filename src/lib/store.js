import {writable} from "svelte/store";
import Nostr from "$lib/Nostr"
import { persisted } from 'svelte-local-storage-store'

export const introDismissed = persisted('introDismissed4', false);
export const selectedDuration = persisted('defaultDuration', 4);
export const nostrPool = writable(new Nostr())
export const seenEvents = writable({})
export const nostrNotes = writable({})
export const zaps = writable([])
export const recentZaps = writable([])
export const zapraisers = writable([])
export const profiles = writable({})
export const relayEvents = writable({})
export const zapsPerNote = writable({})
export const totalsPerNote = writable({})
export const totalsPerSender = writable({})
export const totalsPerRecipient = writable({})
export const totalsPerZapper = writable({})
export const loggedUser = writable()