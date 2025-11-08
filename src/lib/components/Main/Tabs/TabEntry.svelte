<script lang="ts">
    import { X } from '@lucide/svelte';
    import { coreAPI } from '$core/CoreAPI.svelte';
    import type { TabEntry } from '$core/internal/stores/TabStore.svelte';


    type Props = {
        entry: TabEntry;
    };
    let { entry }: Props = $props();


    function hasNameInCommon(entry: TabEntry): boolean {
    	const openTabs = coreAPI.tabs;
    	if (openTabs.length <= 1) return false;

    	const nameCount = openTabs.reduce((count, file) => {
    		if (file.title === entry.title) {
    			return count + 1;
    		}
    		return count;
    	}, 0);

    	return nameCount > 1;
    }

    function scrollToView(entry: TabEntry) {
    	return (node: HTMLDivElement) => {
    		if (entry.id === coreAPI.activeTab?.id) {
    			node.scrollIntoView({
    				behavior: 'instant',
    				block: 'nearest',
    				inline: 'center',
    			});
    		}
    	};
    }
</script>

<div class="relative group h-full" {@attach scrollToView(entry)}>
    <div
        class="flex h-full justify-center items-center relative border-b
            {coreAPI.activeTab?.id === entry.id
            	? ' border-green-400'
            	: ' hover:bg-gray-750 border-transparent hover:border-gray-600'} 
            min-w-[120px] max-w-[180px]
            md:min-w-[180px] md:max-w-60
            "
    >
        <button
            onclick={async () => {
            	await coreAPI.activateTab(entry.id);
            }}
            class="flex h-full w-full justify-center items-center cursor-pointer font-medium
                text-gray-200 transition-all duration-200 mx-4 truncate text-ellipsis
                {coreAPI.activeTab?.id === entry.id
                	? 'text-green-100'
                	: 'hover:text-white'}"
        >
            <div class="flex items-center text-sm gap-1 min-w-0">
                <!-- File name -->
                {#if hasNameInCommon(entry) && 'file' in entry}
                    {@const parentDir = entry.file.path.split('/').at(-2)}
                    <span class="text-xs text-gray-400 italic">
                        {parentDir ? `.../${parentDir}/` : './'}
                    </span>
                {/if}
                <span class="">{entry.title}</span>
            </div>
        </button>
        <!-- Close button -->
        <button
            class="absolute cursor-pointer top-2 right-2 w-6 h-6 flex justify-center items-center
                text-gray-500 hover:text-white rounded-full
                transition-all duration-200 opacity-100 md:opacity-0 group-hover:opacity-100
                text-xs font-bold"
            onclick={async (e) => {
            	e.stopPropagation();
            	await coreAPI.closeTab(entry.id);
            }}
        >
            <X />
        </button>
    </div>
</div>
