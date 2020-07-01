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

 Date: 06/30/2020 18:33:11
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;


DROP TABLE IF EXISTS `menu_authority`;
/*==============================================================*/
/* Table: menu_authority                                        */
/*==============================================================*/
CREATE TABLE `menu_authority` (
   id   int(8) NOT NULL AUTO_INCREMENT COMMENT 'id',
   previous_id   int(8),
   name  varchar(255) NOT NULL COMMENT '菜单名称',
   is_show  varchar(255) NOT NULL COMMENT '是否展示',
   link  varchar(255) NOT NULL COMMENT '路由',
   sort int(8) NOT NULL COMMENT '排列序号',
   primary key (id)
);

alter table menu_authority add constraint FK_previous_id foreign key (previous_id)
      references menu_authority (id) on delete restrict on update restrict;
/* 预先插入一条信息顶层菜单信息                                     */
INSERT INTO `menu_authority` VALUES (1, 0, '顶层菜单', '是', '/', 1);

-- ----------------------------
-- Table structure for checks
-- ----------------------------
DROP TABLE IF EXISTS `checks`;
CREATE TABLE `checks`  (
  `id` int(8) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `uid` int(8) NOT NULL COMMENT 'uid',
  `course_id` int(8) UNSIGNED NOT NULL COMMENT '课程id',
  `count` int(8) NOT NULL COMMENT '第几次签到',
  `check_state` int(1) NOT NULL COMMENT '签到状态',
  `check_time` bigint(15) NOT NULL COMMENT '签到时间 ms',
  `check_location` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '签到地点',
  `remarks` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `distance` int(6) NOT NULL COMMENT '距离',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `checks_uid`(`uid`) USING BTREE,
  INDEX `checks_course_id`(`course_id`) USING BTREE,
  CONSTRAINT `checks_course_id` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `checks_uid` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 55 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for systemenvs
-- ----------------------------
DROP TABLE IF EXISTS `systemenvs`;
CREATE TABLE `systemenvs`  (
  `id` int(8) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `uid` int(8) NOT NULL COMMENT 'uid',
  `experience` int(8) NOT NULL COMMENT '签到一次几点经验值',
  `distance` int(6) NOT NULL COMMENT '允许签到距离',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `uid`(`uid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- pre Records of systemenvs
-- ----------------------------
INSERT INTO `systemenvs` VALUES (1, 1, 3, 1000);

-- ----------------------------
-- Table structure for courses
-- ----------------------------
DROP TABLE IF EXISTS `courses`;	
CREATE TABLE `courses`  (
  `course_id` int(8) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '课程id',
  `course_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '课程名称',
  `course_code` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '课程代码',
  `place` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '上课地点（文字）',
  `location` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '上课地点gps信息',
  `time` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '上课时间',
  `stu_count` int(5) NOT NULL COMMENT '学生人数',
  `teacher` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '授课教师',
  `creater_uid` int(8) NOT NULL COMMENT '创建者uid',
  `check_count` int(8) NOT NULL COMMENT '签到次数',
  `start_time` bigint(15) NOT NULL COMMENT '签到开始时间',
  `end_time` bigint(15) NOT NULL COMMENT '签到结束时间',
  PRIMARY KEY (`course_id`) USING BTREE,
  INDEX `creater_uid`(`creater_uid`) USING BTREE,
  CONSTRAINT `creater_uid` FOREIGN KEY (`creater_uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for dictinfo
-- ----------------------------
DROP TABLE IF EXISTS `dictinfo`;
CREATE TABLE `dictinfo`  (
  `id` int(8) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `typeid` int(8) NOT NULL COMMENT '类型id',
  `info` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '文本描述',
  `typestate` int(1) NOT NULL COMMENT '默认',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `typeid`(`typeid`) USING BTREE,
  CONSTRAINT `typeid` FOREIGN KEY (`typeid`) REFERENCES `dicttype` (`typeid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for dicttype
-- ----------------------------
DROP TABLE IF EXISTS `dicttype`;
CREATE TABLE `dicttype`  (
  `typeid` int(8) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `typenameChinese` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '中文',
  `typenameEnglish` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '英文',
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '描述',
  PRIMARY KEY (`typeid`) USING BTREE,
  UNIQUE INDEX `typenameChinese`(`typenameChinese`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for manager
-- ----------------------------
DROP TABLE IF EXISTS `manager`;
CREATE TABLE `manager`  (
  `id` int(8) UNSIGNED NOT NULL AUTO_INCREMENT,
  `uid` int(8) NOT NULL COMMENT '用户uid',
  `mUser` int(8) NOT NULL DEFAULT 0 COMMENT '用户表管理权限',
  `mCourse` int(8) NOT NULL DEFAULT 0 COMMENT '课程表管理权限',
  `mCheck` int(8) NOT NULL DEFAULT 0 COMMENT '签到表管理权限',
  `mStudent` int(8) NOT NULL DEFAULT 0 COMMENT '学生表管理权限',
  `mDict` int(8) NOT NULL DEFAULT 0 COMMENT '数据字典管理权限',
  `mManage` int(8) NOT NULL DEFAULT 0 COMMENT '管理表管理权限',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `uid`(`uid`) USING BTREE,
  CONSTRAINT `uid` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for students
-- ----------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students`  (
  `id` int(8) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `uid` int(8) NOT NULL COMMENT '学生id',
  `course_id` int(8) UNSIGNED NOT NULL COMMENT '课程id',
  `check_count` int(8) NOT NULL COMMENT '签到次数',
  `lack_count` int(8) NOT NULL DEFAULT 0 COMMENT '缺勤次数',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `students_course_id`(`course_id`) USING BTREE,
  INDEX `student_uid`(`uid`) USING BTREE,
  CONSTRAINT `student_uid` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `students_course_id` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 46 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `uid` int(8) NOT NULL AUTO_INCREMENT COMMENT 'uid',
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '邮箱',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码MD5',
  `type` int(1) NOT NULL COMMENT '用户类型（1：超级管理员；2:教师用户；3：学生用户）',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '姓名',
  `nick_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '昵称',
  `gender` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '性别',
  `phone` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '手机号',
  `stu_code` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '学号',
  `school` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '学校',
  `department` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '学院',
  `profession` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '专业',
  `last_login_time` bigint(15) NOT NULL COMMENT '上次登录时间',
  `reg_time` bigint(15) NOT NULL COMMENT '注册时间',
  PRIMARY KEY (`uid`) USING BTREE,
  UNIQUE INDEX `email`(`email`) USING BTREE,
  UNIQUE INDEX `phone`(`phone`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 42 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Triggers structure for table checks
-- ----------------------------
DROP TRIGGER IF EXISTS `trigger_checks_check_count_insert`;
delimiter ;;
CREATE TRIGGER `trigger_checks_check_count_insert` AFTER INSERT ON `checks` FOR EACH ROW BEGIN
DECLARE course_checks INT(8);
UPDATE students SET check_count = (SELECT COUNT(uid) FROM checks WHERE uid = NEW.uid AND course_id = NEW.course_id) 
WHERE course_id = NEW.course_id AND uid = NEW.uid;
SET course_checks = (SELECT check_count FROM courses WHERE course_id = NEW.course_id);
UPDATE students SET lack_count = course_checks - check_count WHERE course_id = NEW.course_id AND uid = NEW.uid;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table courses
-- ----------------------------
DROP TRIGGER IF EXISTS `trigger_course_check_count_update`;
delimiter ;;
CREATE TRIGGER `trigger_course_check_count_update` AFTER UPDATE ON `courses` FOR EACH ROW BEGIN
DECLARE course_checks INT(8);
SET course_checks = NEW.check_count;
UPDATE students SET lack_count = course_checks - check_count WHERE course_id = NEW.course_id;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table students
-- ----------------------------
DROP TRIGGER IF EXISTS `trigger_students_delete`;
delimiter ;;
CREATE TRIGGER `trigger_students_delete` AFTER DELETE ON `students` FOR EACH ROW BEGIN
DELETE FROM checks WHERE uid = OLD.uid AND course_id = OLD.course_id;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
