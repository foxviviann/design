// assets/scripts/modal.js

// 图片弹出层功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const currentIndex = document.getElementById('currentIndex');
    const totalImages = document.getElementById('totalImages');
    const modalImageContainer = document.querySelector('.modal-image-container');
    
    // 定义每个项目的图片数组
        const projectImages = {
            project1: [
                'assets/images/1keting/1.jpeg',
                'assets/images/1keting/2.jpeg',
                'assets/images/1keting/3.jpeg',
                'assets/images/1keting/4.jpeg',
                'assets/images/1keting/5.jpeg'
            ],
            project2: [
                'assets/images/2chufang/chufang1.jpeg',
                'assets/images/2chufang/chufang2.jpeg',
                'assets/images/2chufang/chufang3.jpeg',
                'assets/images/2chufang/chufang4.jpeg'
            ],
            project3: [
                'assets/images/ChineseStyle/IMG_3663.JPG',
                'assets/images/ChineseStyle/IMG_3662.JPG'
            ],
            project4: [
                'assets/images/4shufang/1.jpeg',
                'assets/images/4shufang/2.jpeg',
                'assets/images/4shufang/3.jpeg'
            ],
            project5: [
                'assets/images/SongStyle/IMG_3717.JPG',
                'assets/images/SongStyle/IMG_3716.JPG', // 假设有其他相关图片
                'assets/images/SongStyle/IMG_3718.JPG'
            ],
            project6: [
                'assets/images/6shangye/1.jpg',
                'assets/images/6shangye/2.jpg',
                'assets/images/6shangye/3.jpg',
                'assets/images/6shangye/4.jpg',
                'assets/images/6shangye/5.jpg',
                'assets/images/6shangye/6.jpg',
                'assets/images/6shangye/7.jpg',
                'assets/images/6shangye/8.jpg'
            ],
            modern: [
                'assets/images/ModernStyle/IMG_3693.JPG',
                'assets/images/ModernStyle/IMG_3691.JPG',
                'assets/images/ModernStyle/IMG_3692.JPG',
                'assets/images/ModernStyle/IMG_3694.JPG',
                'assets/images/ModernStyle/IMG_3695.JPG',
                'assets/images/ModernStyle/IMG_3696.JPG',
                'assets/images/ModernStyle/IMG_3697.JPG'
            ],
            chinese: [
                'assets/images/ChineseStyle/IMG_3658.JPG',
                'assets/images/ChineseStyle/IMG_3656.JPG',
                'assets/images/ChineseStyle/IMG_3657.JPG',
                'assets/images/ChineseStyle/IMG_3659.JPG',
                'assets/images/ChineseStyle/IMG_3660.JPG',
                'assets/images/ChineseStyle/IMG_3661.JPG',
                'assets/images/ChineseStyle/IMG_3662.JPG',
                'assets/images/ChineseStyle/IMG_3663.JPG',
                'assets/images/ChineseStyle/IMG_3664.JPG'
            ],
            song: [
                'assets/images/SongStyle/IMG_3715.JPG',
                'assets/images/SongStyle/IMG_3707.JPG',
                'assets/images/SongStyle/IMG_3708.JPG',
                'assets/images/SongStyle/IMG_3709.JPG',
                'assets/images/SongStyle/IMG_3710.JPG',
                'assets/images/SongStyle/IMG_3711.JPG',
                'assets/images/SongStyle/IMG_3712.JPG',
                'assets/images/SongStyle/IMG_3713.JPG',
                'assets/images/SongStyle/IMG_3714.JPG',
                'assets/images/SongStyle/IMG_3715.JPG',
                'assets/images/SongStyle/IMG_3716.JPG',
                'assets/images/SongStyle/IMG_3717.JPG',
                'assets/images/SongStyle/IMG_3718.JPG',
                'assets/images/SongStyle/IMG_3719.JPG',
                'assets/images/SongStyle/IMG_3720.JPG',
                'assets/images/SongStyle/IMG_3721.JPG',
                'assets/images/SongStyle/IMG_3722.JPG'
            ]
        };
    
    let currentProject = '';
    let currentImageIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    let dragOffset = 0;
    const swipeThreshold = 50; // 滑动阈值，单位px
    
    // 为每个作品项添加点击事件
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', function() {
            // 获取该项目的标识符
            currentProject = this.getAttribute('data-project');
            
            // 获取点击的图片在数组中的索引
            const clickedImg = this.querySelector('img').src;
            const imageArray = projectImages[currentProject];
            currentImageIndex = 0; // 默认从第一张开始
            
            // 如果点击的图片在数组中，找到其索引
            for (let i = 0; i < imageArray.length; i++) {
                if (clickedImg.includes(imageArray[i].split('/').pop())) {
                    currentImageIndex = i;
                    break;
                }
            }
            
            // 显示图片
            modalImg.src = projectImages[currentProject][currentImageIndex];
            updateCounter();
            
            // 显示模态框
            modal.style.display = 'block';
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // 防止背景滚动
            
            // 重置图片位置
            modalImg.style.transform = 'translateX(0)';
        });
    });
    
    // 关闭模态框
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // 恢复背景滚动
    });
    
    // 点击模态框背景关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // 上一张图片
    prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        goToPrevImage();
    });
    
    // 下一张图片
    nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        goToNextImage();
    });
    
    // 触摸事件处理 - 开始触摸
    modalImageContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        isDragging = true;
        modalImg.style.transition = 'none'; // 禁用过渡效果，实现平滑拖动
    }, { passive: true });
    
    // 触摸事件处理 - 触摸移动
    modalImageContainer.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        touchEndX = e.changedTouches[0].screenX;
        dragOffset = touchEndX - touchStartX;
        
        // 应用拖动偏移
        modalImg.style.transform = `translateX(${dragOffset}px)`;
    }, { passive: true });
    
    // 触摸事件处理 - 触摸结束
    modalImageContainer.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        
        isDragging = false;
        modalImg.style.transition = 'transform 0.3s ease'; // 恢复过渡效果
        
        // 计算滑动距离
        const swipeDistance = touchEndX - touchStartX;
        
        // 如果滑动距离超过阈值，则切换图片
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // 向右滑动 - 上一张图片
                goToPrevImage();
            } else {
                // 向左滑动 - 下一张图片
                goToNextImage();
            }
        } else {
            // 滑动距离不足，恢复原位
            modalImg.style.transform = 'translateX(0)';
        }
    }, { passive: true });
    
    // 上一张图片函数
    function goToPrevImage() {
        if (currentProject && projectImages[currentProject].length > 0) {
            currentImageIndex = (currentImageIndex - 1 + projectImages[currentProject].length) % projectImages[currentProject].length;
            modalImg.src = projectImages[currentProject][currentImageIndex];
            updateCounter();
            
            // 添加过渡动画
            modalImg.style.transform = 'translateX(100px)';
            setTimeout(() => {
                modalImg.style.transform = 'translateX(0)';
            }, 10);
        }
    }
    
    // 下一张图片函数
    function goToNextImage() {
        if (currentProject && projectImages[currentProject].length > 0) {
            currentImageIndex = (currentImageIndex + 1) % projectImages[currentProject].length;
            modalImg.src = projectImages[currentProject][currentImageIndex];
            updateCounter();
            
            // 添加过渡动画
            modalImg.style.transform = 'translateX(-100px)';
            setTimeout(() => {
                modalImg.style.transform = 'translateX(0)';
            }, 10);
        }
    }
    
    // 键盘导航
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                // 左箭头键 - 上一张
                goToPrevImage();
            } else if (e.key === 'ArrowRight') {
                // 右箭头键 - 下一张
                goToNextImage();
            } else if (e.key === 'Escape') {
                // ESC键 - 关闭模态框
                modal.style.display = 'none';
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    });
    
    // 更新计数器
    function updateCounter() {
        currentIndex.textContent = currentImageIndex + 1;
        totalImages.textContent = projectImages[currentProject].length;
    }
    
    // 防止图片被拖动（在某些浏览器中默认行为）
    modalImg.addEventListener('dragstart', function(e) {
        e.preventDefault();
    });
});