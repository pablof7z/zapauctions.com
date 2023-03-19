<script>
</script>

<div id="lodging">
    <div class="flex">
        <textarea
            name="content"
            id=""
            cols="30"
            rows="10"
            class="
            w-full rounded-lg p-4 text-lg
            text-black
        "
        />
    </div>
    <div class="flex flex-col md:flex-row">
        <div class="my-3 flex-1 md:mr-1">
            <label for="checkIn" class="block font-medium">Start time</label>
            <input
                type="datetime-local"
                name="startTime"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black text-2xl py-3"
            />
        </div>

        <div class="my-3 flex-1 md:ml-1">
            <label class="block font-medium">End time</label>
            <input
                type="datetime-local"
                name="endTime"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black text-2xl py-3"
            />
        </div>
    </div>

    <div class="my-3 flex-1 md:mr-1">
        <label class="block font-medium">Blocks after end time</label>
        <input
            type="number"
            name="blocksAfterEndTime"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black text-2xl py-3"
        />
        <span class="text-sm"
            >(Optional) Randomize the end time with the timechain; wait this amount of blocks after
            end time</span
        >
    </div>

    <div class="my-3 flex-1 md:ml-1">
        <label class="block font-medium">⚡️ Reserve price</label>
        <input
            type="number"
            name="price"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black text-2xl py-3"
        />
        <span class="text-sm">(Optional) At least this amount of sats must be zapped</span>
    </div>
</div>
