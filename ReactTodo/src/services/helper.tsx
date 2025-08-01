function TruncateWords($string: string, $number: number) {
    let words = $string.split(" ");
    if (words.length <= $number) { return $string; }
    let truncateWords = words.slice(0, $number);
    return truncateWords.join(" ");
}

export default TruncateWords;
