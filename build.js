import { loadEnv } from 'vite'
import fs from 'fs'
import path from 'path'

const env = loadEnv(process.env.mode, process.cwd());

// 拷贝目录文件
const copyDirectory = (srcDir, destDir) => {
    // 判断目标目录是否存在，不存在则创建
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir)
    }

    fs.readdirSync(srcDir).forEach((file) => {
        const srcPath = path.join(srcDir, file)
        const destPath = path.join(destDir, file)

        if (fs.lstatSync(srcPath).isDirectory()) {
            // 递归复制子目录
            copyDirectory(srcPath, destPath)
        } else {
            // 复制文件
            fs.copyFileSync(srcPath, destPath)
        }
    })
}

// 删除目录及文件
const deleteDirectory = (dir) => {
    if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach((file) => {
            const curPath = path.join(dir, file)
            if (fs.lstatSync(curPath).isDirectory()) {
                // 递归删除子目录
                deleteDirectory(curPath)
            } else {
                // 删除文件
                fs.unlinkSync(curPath)
            }
        })
        // 删除空目录
        fs.rmdirSync(dir)
    }
}

// 目标目录：Chrome Extension 最终build目录
const outDir = path.resolve(process.cwd(), env.VITE_OUTDIR)
// 源目录 script临时生成目录
const contentOutDir = path.resolve(process.cwd(), env.VITE_CONTENT_OUTDIR)
const backgroundOutDir = path.resolve(process.cwd(), env.VITE_BACKGROUND_OUTDIR)

copyDirectory(contentOutDir, outDir)
copyDirectory(backgroundOutDir, outDir)
deleteDirectory(contentOutDir)
deleteDirectory(backgroundOutDir)