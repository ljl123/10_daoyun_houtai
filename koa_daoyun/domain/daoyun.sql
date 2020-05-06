/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2020/3/27 23:15:54                           */
/*==============================================================*/


drop trigger checkserver.trigger_checks_check_count_insert;

drop trigger checkserver.trigger_course_check_count_update;

drop table if exists checkserver.checks;

drop table if exists checkserver.courses;

drop table if exists checkserver.dictinfo;

drop table if exists checkserver.dicttype;

drop table if exists menu_authority;

drop table if exists roles;

drop table if exists users;

/*==============================================================*/
/* User: checkserver                                            */
/*==============================================================*/
create user checkserver;

/*==============================================================*/
/* Table: checks                                                */
/*==============================================================*/
create table checkserver.checks
(
   id                   int not null,
   user_id              int not null,
   course_id            int not null comment '课程id',
   count                int not null comment '第几次签到',
   check_state          int(1) not null comment '签到状态',
   time                 bigint(15) not null comment '签到时间 ms',
   creater              varchar(255),
   creationdate         varchar(255),
   modifier             varchar(255),
   modificationdate     varchar(255),
   primary key (id)
);

/*==============================================================*/
/* Table: courses                                               */
/*==============================================================*/
create table checkserver.courses
(
   id                   int unsigned not null auto_increment comment '课程id',
   name                 national varchar(255) not null comment '课程名称',
   teacher              national varchar(255) not null comment '课程代码',
   stu_count            national varchar(255) not null comment '上课地点（文字）',
   creater              varchar(255),
   creationdate         varchar(255),
   modifier             varchar(255),
   modificationdate     varchar(255),
   primary key (id)
);

/*==============================================================*/
/* Table: dictinfo                                              */
/*==============================================================*/
create table checkserver.dictinfo
(
   id                   int not null auto_increment comment 'id',
   type_id              int not null comment '类型id',
   type_level           int(3) not null comment '在类别中的级别',
   type_belong          int(3) not null comment '在大类中 又是谁的子类 1为最高level',
   value                national varchar(255) not null comment '字典内容',
   creater              varchar(255),
   creationdate         varchar(255),
   modifier             varchar(255),
   modificationdate     varchar(255),
   primary key (id)
);

/*==============================================================*/
/* Table: dicttype                                              */
/*==============================================================*/
create table checkserver.dicttype
(
   id                   int not null auto_increment comment 'id',
   name                 national varchar(255) not null comment '类型名称',
   creater              varchar(255),
   creationdate         varchar(255),
   modifier             varchar(255),
   modificationdate     varchar(255),
   primary key (id)
);

/*==============================================================*/
/* Table: menu_authority                                        */
/*==============================================================*/
create table menu_authority
(
   id                   int not null,
   previous_id          int,
   name                 varchar(255) not null,
   primary key (id)
);

/*==============================================================*/
/* Table: roles                                                 */
/*==============================================================*/
create table roles
(
   id                   int not null,
   name                 varchar(255) not null,
   creater              varchar(255),
   creationdate         varchar(255),
   modifier             varchar(255),
   modificationdate     varchar(255),
   primary key (id)
);

/*==============================================================*/
/* Table: users                                                 */
/*==============================================================*/
create table users
(
   id                   int not null,
   role_id              int not null,
   course_id            int not null,
   name                 varchar(255) not null,
   phone                varchar(255) not null,
   email                varchar(255) not null,
   password             varchar(255) not null,
   school               varchar(255) not null,
   creater              varchar(255) not null,
   creationdate         varchar(255) not null,
   modifier             varchar(255) not null,
   modificationdate     varchar(255) not null,
   primary key (id)
);

alter table checkserver.checks add constraint FK_course_id1 foreign key (course_id)
      references checkserver.courses (id) on delete restrict on update restrict;

alter table checkserver.checks add constraint FK_user_id foreign key (user_id)
      references users (id) on delete restrict on update restrict;

alter table checkserver.dictinfo add constraint typeid foreign key (type_id)
      references checkserver.dicttype (id);

alter table menu_authority add constraint FK_previous_id foreign key (previous_id)
      references menu_authority (id) on delete restrict on update restrict;

alter table users add constraint FK_course_id foreign key (course_id)
      references checkserver.courses (id) on delete restrict on update restrict;

alter table users add constraint FK_role_id foreign key (role_id)
      references roles (id) on delete restrict on update restrict;


create trigger trigger_checks_check_count_insert after insert
   on checkserver.checks for each row
BEGIN
DECLARE course_checks INT(8);
UPDATE students SET check_count = (SELECT COUNT(uid) FROM checks WHERE uid = NEW.uid AND course_id = NEW.course_id) 
WHERE course_id = NEW.course_id AND uid = NEW.uid;
SET course_checks = (SELECT check_count FROM courses WHERE course_id = NEW.course_id);
UPDATE students SET lack_count = course_checks - check_count WHERE course_id = NEW.course_id AND uid = NEW.uid;
END;


create trigger trigger_course_check_count_update after update
   on checkserver.courses for each row
BEGIN
DECLARE course_checks INT(8);
SET course_checks = NEW.check_count;
UPDATE students SET lack_count = course_checks - check_count WHERE course_id = NEW.course_id;
END;

