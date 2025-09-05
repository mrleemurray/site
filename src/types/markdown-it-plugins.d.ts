// Type definitions for markdown-it plugins that don't have official types

declare module 'markdown-it-toc-done-right' {
  import { PluginSimple } from 'markdown-it'
  interface TocOptions {
    includeLevel?: number[]
    containerClass?: string
    listType?: 'ul' | 'ol'
  }
  const plugin: PluginSimple<TocOptions>
  export = plugin
}

declare module 'markdown-it-footnote' {
  import { PluginSimple } from 'markdown-it'
  const plugin: PluginSimple
  export = plugin
}

declare module 'markdown-it-container' {
  import { PluginWithOptions } from 'markdown-it'
  interface ContainerOptions {
    render?: (tokens: any[], idx: number) => string
  }
  const plugin: PluginWithOptions<ContainerOptions>
  export = plugin
}

declare module 'markdown-it-task-lists' {
  import { PluginSimple } from 'markdown-it'
  interface TaskListOptions {
    enabled?: boolean
  }
  const plugin: PluginSimple<TaskListOptions>
  export = plugin
}

declare module 'markdown-it-mark' {
  import { PluginSimple } from 'markdown-it'
  const plugin: PluginSimple
  export = plugin
}

declare module 'markdown-it-ins' {
  import { PluginSimple } from 'markdown-it'
  const plugin: PluginSimple
  export = plugin
}

declare module 'markdown-it-abbr' {
  import { PluginSimple } from 'markdown-it'
  const plugin: PluginSimple
  export = plugin
}