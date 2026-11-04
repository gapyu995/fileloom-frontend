/** All product copy is registered with the host locale service. */
export const en = {
  movies: 'Movies', music: 'Music', photos: 'Photos', files: 'Files',
  root: 'Library', folder: 'Folder', search: 'Filter this folder', sort: 'Sort',
  name: 'Name', newest: 'Newest first', refresh: 'Refresh', retry: 'Retry', up: 'Parent folder',
  empty: 'No matching files', noRoots: 'No file libraries are configured',
  unavailable: 'Could not load files. Retry to refresh this folder.',
  unauthorized: 'Your session has expired. Sign in again, then retry.',
  invalidResponse: 'The file service returned an unreadable response. Refresh or check the host version.',
  previewFailed: 'This preview could not be loaded. Check the file and retry.',
  previewLimit: 'This file exceeds the host preview limit (64 MB).',
  unsupported: 'A preview is not available for this file type.',
  close: 'Close preview', previous: 'Previous', next: 'Next', play: 'Play',
  open: 'Open', items: 'items', size: 'Size', modified: 'Modified', path: 'Path',
  loading: 'Loading', preview: 'Preview', languageTag: 'en', textTruncated: 'Text preview shortened',
}

export type CopyKey = keyof typeof en
export type Dictionary = Record<CopyKey, string>
export type Translate = (key: CopyKey) => string

export const zh: Dictionary = {
  movies: '电影', music: '音乐', photos: '图片', files: '文件',
  root: '文件库', folder: '文件夹', search: '筛选当前文件夹', sort: '排序',
  name: '名称', newest: '最新修改', refresh: '刷新', retry: '重试', up: '上级文件夹',
  empty: '没有匹配的文件', noRoots: '尚未配置文件库',
  unavailable: '无法加载文件，请重试刷新当前文件夹',
  unauthorized: '登录已过期，请重新登录后重试',
  invalidResponse: '文件服务返回的数据无法读取，请刷新或检查宿主版本',
  previewFailed: '无法加载预览，请检查文件后重试',
  previewLimit: '此文件超过宿主的预览上限（64 MB）',
  unsupported: '此文件类型暂不支持预览',
  close: '关闭预览', previous: '上一个', next: '下一个', play: '播放',
  open: '打开', items: '项', size: '大小', modified: '修改时间', path: '路径',
  loading: '加载中', preview: '预览', languageTag: 'zh-CN', textTruncated: '文本预览已截短',
}
