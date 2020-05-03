const CourseService = require('../services/course-service')

module.exports = {
    'POST /api/course/create': async (ctx, next) => {
        ctx.rest(await CourseService.createCourse(ctx,next))
    },
    'GET /api/course/course': async (ctx, next) => {
        ctx.rest(await CourseService.getCourseList(ctx,next))
    },
    'GET /api/course/info': async (ctx, next) => {
        ctx.rest(await CourseService.getCourseInfo(ctx,next))
    },
    'GET /api/course/search': async (ctx, next) => {
        ctx.rest(await CourseService.searchCourse(ctx,next))
    },
    'POST /api/course/add': async (ctx, next) => {
        ctx.rest(await CourseService.addCourse(ctx,next))
    },
    'PUT /api/course/info': async (ctx, next) => {
        ctx.rest(await CourseService.modifyCourseInfo(ctx,next))
    },
    'GET /api/course/students': async (ctx, next) => {
        ctx.rest(await CourseService.getStudentsList(ctx,next))
    },
    'DELETE /api/course/students': async (ctx, next) => {
        ctx.rest(await CourseService.deleteStudent(ctx,next))
    },
    'PUT /api/course/students': async (ctx, next) => {
        ctx.rest(await CourseService.modifyStudent(ctx,next))
    },
    'GET /api/course/checklist': async (ctx, next) => {
        ctx.rest(await CourseService.getCheckList(ctx,next))
    },
    'DELETE /api/course/checklist': async (ctx, next) => {
        ctx.rest(await CourseService.deleteCheckList(ctx,next))
    },
    'PUT /api/course/checklist': async (ctx, next) => {
        ctx.rest(await CourseService.modifyCheckList(ctx,next))
    },
    'POST /api/course/stu2course': async (ctx, next) => {
        ctx.rest(await CourseService.addStudent2Course(ctx,next))
    },
}