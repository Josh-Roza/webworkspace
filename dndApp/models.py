from django.db import models

class Monster(models.Model):
    name = models.CharField(max_length=100)
    HP = models.IntegerField()
    AC = models.IntegerField()
    CR = models.CharField(max_length=10)
    speed = models.CharField(max_length=300)
    stats = models.CharField(max_length=100)
    skills = models.TextField()
    attributes = models.TextField()
    actions = models.TextField()
    legendaryActions = models.TextField()
    rangedAttack = models.BooleanField(default=False)
    pack = models.CharField(max_length=100)

    def __str__(self):
        return self.name


