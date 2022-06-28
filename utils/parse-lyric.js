const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/ // [00:00.000] 作词

export function parseLyric(lyricString) {
  const lyricInfos = []
  if (lyricString.length === 0) return lyricInfos
 
  const lyricStrings = lyricString.split('\n') // [  [00:00.000] 作词, [00:01.000] 作曲  ]

  for (const lyricString of lyricStrings) {
    const timeResult = timeRegExp.exec(lyricString)
    if (!timeResult) continue
    // 获取时间
    const minute = timeResult[1] * 60 * 1000 // 分钟 -> 毫秒
    const second = timeResult[2] * 1000 // 秒 -> 毫秒
    const millsecondTime = timeResult[3] // 毫秒(三位数)
    const millsecond = millsecondTime.length == 2 ? millsecondTime * 10 : millsecondTime * 1
    const time = minute + second + millsecond

    // 获取文本
    const text = lyricString.replace(timeRegExp, '')

    lyricInfos.push({
      time,
      text
    })
  }

  return lyricInfos
}