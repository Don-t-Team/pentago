const getPivot = (left, right) => {
    return Math.floor((right + left) / 2)
}

const swap = (arr, left, right) => {
    const temp = arr[left]
    arr[left] = arr[right]
    arr[right] = temp
}

const partition = (arr, left, right, pivot) => {
    while(left <= right) {
        while (arr[left][0] < arr[pivot][0]) {
            left++
        }
        while (left <= right && arr[right][0] >= arr[pivot][0]) {
            right--
        }
        if (right > left) {
            swap(arr, left, right)
        }
    }
    return left
}

const quicksort = (arr, left, right) => {

    let pivot = getPivot(left, right)
    // move pivot index to the end of the array
    swap(arr, pivot, right)

    let par = partition(arr, left, right - 1, pivot)

    swap(arr, par, right)
    if (left < par - 1) 
        quicksort(arr, left, par - 1)
    if (right > par + 1)
        quicksort(arr, par + 1, right)
}

const arr = [[0, 1], [2, 1], [3, 1], [5, 1], [3, 4], [5, 4], [1, 1]]

quicksort(arr, 0, arr.length - 1)

console.log(arr)

export default quicksort