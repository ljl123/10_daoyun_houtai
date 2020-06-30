/*
 Navicat Premium Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 50463
 Source Host           : 121.89.192.99:3306
 Source Schema         : checkserver

 Target Server Type    : MySQL
 Target Server Version : 50463
 File Encoding         : 65950

 Date: 06/30/2020 18:34:11
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (19, '280387803@qq.com', 'e10adc3949ba59abbe56e057f20f883e', 3, '李杰铃', '到云_280387804@qq.com', '男', '13809570023', '190327046', '福州大学', '数计学院', '计算机技术', 1561703973974, 1561701526156);
INSERT INTO `users` VALUES (20, '913209061@qq.com', 'e10adc3949ba59abbe56e057f20f883e', 3, '陈文昕', '到云_1339727588@qq.com', '女', '18300000001', '190327088', '福州大学', '数计学院', '计算机技术', 1561895007189, 1561894957843);
INSERT INTO `users` VALUES (21, '864655675@qq.com', 'e10adc3949ba59abbe56e057f20f883e', 3, '陈辉', '到云_1339727588@qq.com', '男', '18300000002', '190327088', '福州大学', '数计学院', '计算机技术', 1561895007189, 1561894957843);
INSERT INTO `users` VALUES (22, '376806225@qq.com', 'e10adc3949ba59abbe56e057f20f883e', 3, '康达', '到云_1339727588@qq.com', '', '18300000003', '190327088', '福州大学', '数计学院', '计算机技术', 1561895007189, 1561894957843);
INSERT INTO `users` VALUES (23, '497409213@qq.com', 'e10adc3949ba59abbe56e057f20f883e', 3, '杨伟鑫', '到云_1339727588@qq.com', '', '18300000004', '190327088', '福州大学', '数计学院', '计算机技术', 1561895007189, 1561894957843);
INSERT INTO `users` VALUES (24, '18759923858@163.com', 'e10adc3949ba59abbe56e057f20f883e', 2, '李老师', '到云_9923858@163.com', '', '18459184116', '190327088', '福州大学', '数计学院', '计算机技术', 1561895007189, 1561894957843);
INSERT INTO `users` VALUES (25, '497409212@qq.com', 'e10adc3949ba59abbe56e057f20f883e', 1, 'admin', '到云_497409212@qq.com', '', '15900000001', '190327088', '福州大学', '数计学院', '计算机技术', 1561895007189, 1561894957843);
INSERT INTO `users` VALUES (26, '280387804@qq.com', 'e10adc3949ba59abbe56e057f20f883e', 2, 'teacher', '到云_280387804@qq.com', '', '15900000002', '190327088', '福州大学', '数计学院', '计算机技术', 1561895007189, 1561894957843);
INSERT INTO `users` VALUES (27, '913209060@qq.com', 'e10adc3949ba59abbe56e057f20f883e', 3, 'student1', '到云_913209060@qq.com', '', '15900000003', '190327088', '福州大学', '数计学院', '计算机技术', 1561895007189, 1561894957843);
INSERT INTO `users` VALUES (28, '864655674@qq.com', 'e10adc3949ba59abbe56e057f20f883e', 3, 'student2', '到云_864655674@qq.com', '', '15900000004', '190327088', '福州大学', '数计学院', '计算机技术', 1561895007189, 1561894957843);


-- ----------------------------
-- Records of users
-- ----------------------------
-- ----------------------------
-- Records of checks
-- ----------------------------
INSERT INTO `checks` VALUES (7, 27, 5, 1, 1, 1561681899000, '26,119', '准时', 0);
INSERT INTO `checks` VALUES (8, 28, 5, 1, 1, 1561681899000, '26,119', '无', 0);
INSERT INTO `checks` VALUES (9, 27, 6, 1, 1, 1561681899000, '26,119', '无', 0);
INSERT INTO `checks` VALUES (10, 28, 6, 1, 1, 1561681899000, '26,119', '无', 0);
INSERT INTO `checks` VALUES (11, 29, 6, 1, 1, 1561681899000, '26,119', '无', 0);
INSERT INTO `checks` VALUES (12, 30, 6, 1, 1, 1561681899000, '26,119', '无', 0);
INSERT INTO `checks` VALUES (13, 31, 6, 1, 1, 1561681899000, '26,119', '无', 0);
INSERT INTO `checks` VALUES (14, 32, 6, 1, 1, 1561681899000, '26,119', '无', 0);
INSERT INTO `checks` VALUES (15, 33, 6, 1, 1, 1561681899000, '26,119', '无', 0);
INSERT INTO `checks` VALUES (16, 34, 6, 1, 1, 1561681899000, '26,119', '无', 0);
INSERT INTO `checks` VALUES (17, 35, 6, 1, 1, 1561681899000, '26,119', '无', 0);
INSERT INTO `checks` VALUES (18, 36, 6, 1, 1, 1561681899000, '26,119', '无', 0);
INSERT INTO `checks` VALUES (19, 37, 8, 2, 1, 1562162822763, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (20, 37, 7, 1, 1, 1562162858005, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (21, 37, 8, 3, 1, 1562164012593, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (22, 27, 14, 1, 1, 1562232683019, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (23, 37, 14, 1, 1, 1562232738916, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (24, 27, 14, 2, 1, 1562233197670, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (25, 28, 13, 1, 1, 1562233211688, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (26, 29, 13, 1, 1, 1562233225468, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (27, 29, 14, 2, 1, 1562233227683, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (28, 30, 13, 1, 1, 1562233238238, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (29, 30, 14, 2, 1, 1562233240354, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (30, 31, 14, 2, 1, 1562233249364, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (31, 31, 13, 1, 1, 1562233251664, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (32, 32, 14, 2, 1, 1562233284353, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (33, 37, 14, 2, 1, 1562233316837, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (34, 27, 14, 3, 1, 1562233544384, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (35, 29, 14, 3, 1, 1562233566653, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (36, 30, 14, 3, 1, 1562233576225, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (37, 31, 14, 3, 1, 1562233584524, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (38, 27, 14, 4, 1, 1562233642664, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (39, 29, 14, 4, 1, 1562233653169, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (40, 30, 14, 4, 1, 1562233662830, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (41, 28, 13, 2, 1, 1562244312424, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (42, 29, 13, 2, 1, 1562244327497, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (43, 27, 15, 1, 1, 1562244497346, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (44, 28, 15, 1, 1, 1562244519741, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (45, 29, 15, 1, 1, 1562244529570, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (46, 35, 16, 1, 1, 1562244750118, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (47, 34, 16, 1, 1, 1562244761878, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (48, 29, 16, 1, 1, 1562244771477, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (49, 29, 14, 5, 1, 1562244819183, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (50, 27, 14, 5, 1, 1562244828744, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (51, 32, 14, 5, 1, 1562244837976, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (52, 30, 14, 5, 1, 1562244857081, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (53, 31, 14, 5, 1, 1562244875880, '0,0', NULL, 999999);
INSERT INTO `checks` VALUES (54, 37, 14, 5, 1, 1562244904567, '0,0', NULL, 999999);

-- ----------------------------
-- Records of courses
-- ----------------------------
INSERT INTO `courses` VALUES (5, '语文', 's6XHkg', '北京', '24.887928,118.918188', '14:00-17:30', 0, '语文老师', 18, 0, 0, 0);
INSERT INTO `courses` VALUES (6, '数学', 'j81ECQ', '数计中207', '24.887928,118.918188', '8:00-10:00', 120, '池老师', 19, 4, 1562057939689, 1562059739689);
INSERT INTO `courses` VALUES (7, '高等数学', 'zl6fpQ', '东3-301', '24.887928,118.918188', '14:00-17:30', 50, '汤家凤', 38, 1, 1562161656935, 1562163456935);
INSERT INTO `courses` VALUES (8, '英语一', 'VEoUgH', '东2-203', '24.887928,118.918188', '08:00-12:00', 46, '何凯文', 38, 3, 1562163983097, 1562164283097);
INSERT INTO `courses` VALUES (9, '英语二', 'pLyN7Y', '数计5号楼105', '24.887928,118.918188', '8:00-12:00', 35, '唐迟', 38, 1, 1562162713742, 1562164513742);
INSERT INTO `courses` VALUES (13, '智能技术', 'fqzkNp', '东2-102', '24.887928,118.918188', '14:00-17:30', 50, '陈老师', 39, 2, 1562244269583, 1562244329583);
INSERT INTO `courses` VALUES (14, '高级机器学习', 'rFwHvj', '数计5号楼106', '24.887928,118.918188', '19:00-21:30', 49, 'x老师', 39, 5, 1562244805615, 1562244925615);
INSERT INTO `courses` VALUES (15, '信息安全', 'JqCyR4', '东2-106', '24.887928,118.918188', '14:00-17:30', 60, 'y老师', 39, 1, 1562244485790, 1562244605790);
INSERT INTO `courses` VALUES (16, '计算机网络', 'odF7tE', '东1-102', '24.887928,118.918188', '8:00-10:00', 120, '康老师', 39, 1, 1562244746314, 1562244806314);
INSERT INTO `courses` VALUES (17, '大数据分析', '5rvVN1', '东3-108', '24.887928,118.918188', '14:00-16:30', 35, '杨老师', 39, 0, 0, 0);
INSERT INTO `courses` VALUES (18, '工程实践', 'OVzLKw', '数计2号楼', '24.887928,118.918188', '8:00-12:00', 10, '李老师', 43, 15, 1593511727318, 1594982956246);

-- ----------------------------
-- Records of dictinfo
-- ----------------------------
INSERT INTO `dictinfo` VALUES (1, 1, '男', true);
INSERT INTO `dictinfo` VALUES (2, 1, '女', false);
INSERT INTO `dictinfo` VALUES (3, 2, '管理员', true);
INSERT INTO `dictinfo` VALUES (4, 2, '学生', false);
INSERT INTO `dictinfo` VALUES (5, 2, '老师', false);

-- ----------------------------
-- Records of dicttype
-- ----------------------------
INSERT INTO `dicttype` VALUES (1, '性别', 'gender', '用户性别');
INSERT INTO `dicttype` VALUES (2, '身份', 'identity', '登入身份');

-- ----------------------------
-- Records of manager
-- ----------------------------
INSERT INTO `manager` VALUES (1, 19, 1, 1, 1, 1, 1, 1);
INSERT INTO `manager` VALUES (3, 24, 1, 1, 1, 1, 1, 1);
INSERT INTO `manager` VALUES (4, 25, 1, 1, 1, 1, 1, 1);

-- ----------------------------
-- Records of students
-- ----------------------------
INSERT INTO `students` VALUES (7, 27, 5, 1, -1);
INSERT INTO `students` VALUES (8, 28, 6, 1, 3);
INSERT INTO `students` VALUES (9, 29, 6, 1, 3);
INSERT INTO `students` VALUES (10, 30, 6, 1, 3);
INSERT INTO `students` VALUES (11, 31, 6, 1, 3);
INSERT INTO `students` VALUES (12, 31, 6, 1, 3);
INSERT INTO `students` VALUES (13, 32, 6, 1, 3);
INSERT INTO `students` VALUES (14, 33, 6, 1, 3);
INSERT INTO `students` VALUES (15, 34, 6, 1, 3);
INSERT INTO `students` VALUES (16, 35, 6, 1, 3);
INSERT INTO `students` VALUES (17, 36, 6, 1, 3);
INSERT INTO `students` VALUES (18, 37, 6, 0, 4);
INSERT INTO `students` VALUES (20, 27, 6, 1, 3);
INSERT INTO `students` VALUES (21, 37, 7, 1, 0);
INSERT INTO `students` VALUES (22, 37, 8, 2, 1);
INSERT INTO `students` VALUES (23, 41, 7, 0, 0);
INSERT INTO `students` VALUES (24, 27, 14, 5, 0);
INSERT INTO `students` VALUES (25, 27, 17, 0, 0);
INSERT INTO `students` VALUES (26, 27, 8, 0, 0);
INSERT INTO `students` VALUES (27, 37, 14, 3, 2);
INSERT INTO `students` VALUES (28, 28, 15, 1, 0);
INSERT INTO `students` VALUES (29, 28, 14, 0, 5);
INSERT INTO `students` VALUES (30, 28, 13, 2, 0);
INSERT INTO `students` VALUES (31, 29, 14, 4, 1);
INSERT INTO `students` VALUES (32, 29, 13, 2, 0);
INSERT INTO `students` VALUES (33, 30, 7, 0, 0);
INSERT INTO `students` VALUES (34, 30, 14, 4, 1);
INSERT INTO `students` VALUES (35, 30, 13, 1, 1);
INSERT INTO `students` VALUES (36, 31, 14, 3, 2);
INSERT INTO `students` VALUES (37, 31, 13, 1, 1);
INSERT INTO `students` VALUES (38, 32, 13, 0, 2);
INSERT INTO `students` VALUES (39, 32, 14, 2, 3);
INSERT INTO `students` VALUES (40, 27, 15, 1, 0);
INSERT INTO `students` VALUES (41, 29, 15, 1, 0);
INSERT INTO `students` VALUES (42, 30, 15, 0, 1);
INSERT INTO `students` VALUES (43, 29, 16, 1, 0);
INSERT INTO `students` VALUES (44, 34, 16, 1, 0);
INSERT INTO `students` VALUES (45, 35, 16, 1, 0);









